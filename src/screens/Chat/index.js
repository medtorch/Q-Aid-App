import React, {useState, useCallback, useEffect} from 'react';
import {
  Icon,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
  Avatar,
  Modal,
  Card,
  Button,
  Popover,
} from '@ui-kitten/components';
import {StyleSheet, View, Image, Alert} from 'react-native';
import {ChatStyle} from '../../components';
import PhotoUpload from 'react-native-photo-upload';

import {Auth} from 'aws-amplify';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';

import {templates, get_reply, get_pretty_category} from './data.js';
import {MenuIcon, InfoIcon, ShareIcon, LogoutIcon, PhotoIcon} from './icons.js';
import {ChatContext} from './context.js';
import {User} from './user.js';
import {Models} from './models.js';
import {CreateAlert} from './utils.js';

var replyIdx = 1;
var ctx = new ChatContext();
var user_ctx = new User();
var models = new Models();

export function Main() {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    user_ctx.load();
    setMessages([generateReply(get_reply('intro'))]);
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  const renderOverflowMenuAction = () => (
    <React.Fragment>
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}>
        <MenuItem accessoryLeft={InfoIcon} title="Models" />
        <MenuItem accessoryLeft={ShareIcon} title="Send to a doctor" />
        <MenuItem
          accessoryLeft={LogoutIcon}
          title="Logout"
          onPress={user_ctx.signOut}
        />
      </OverflowMenu>
    </React.Fragment>
  );

  const fetchPhotoCategory = (bs64img) => {
    setIsTyping(true);
    models.image_router(bs64img, function (err, answer) {
      setIsTyping(false);
      if (err) {
        console.log('image router failed ', err);
        return;
      }
      ctx.category = get_pretty_category(answer);
      setMessages((previousMessages) =>
        GiftedChat.append(
          previousMessages,
          generateReply(
            'That looks like ' +
              ctx.category +
              '. What would you like to know?',
          ),
        ),
      );
    });
  };

  const onPhotoUpload = async (file) => {
    if (file.error || typeof file.uri == 'undefined') {
      console.log('failed to load file ', file);
      return;
    }
    ctx.reset();
    ctx.source.uri = file.uri;
  };
  const onPhotoSelect = (bs64img) => {
    setMessages([generateReply(get_reply('intro'))]);

    models.prefilter(bs64img, function (err, answer) {
      if (err) {
        console.log('prefilter failed ', err);
        CreateAlert(templates.messages.on_error);
        return;
      }
      if (answer === 0) {
        ctx.state = 'valid';
        ctx.image_value = bs64img;

        onImageRequest(ctx.source.uri);
        fetchPhotoCategory(bs64img);
      } else {
        CreateAlert(templates.messages.on_invalid_input);
      }
    });
  };

  const renderImagePicker = () => {
    const [modalVisible, setModalVisible] = React.useState(false);

    return (
      <View style={ChatStyle.container}>
        <Button
          appearance="ghost"
          status="basic"
          size="large"
          accessoryLeft={PhotoIcon}
          onPress={() => setModalVisible(true)}
        />

        <Modal
          visible={modalVisible}
          backdropStyle={ChatStyle.backdrop}
          onBackdropPress={() => setModalVisible(false)}>
          <Card disabled={true}>
            <PhotoUpload
              onResponse={onPhotoUpload}
              onPhotoSelect={onPhotoSelect}>
              <Image
                style={ChatStyle.modalImage}
                resizeMode="cover"
                source={ctx.source}
              />
            </PhotoUpload>
          </Card>
        </Modal>
      </View>
    );
  };

  const renderTitle = (props) => (
    <View style={ChatStyle.titleContainer}>
      <Avatar
        style={ChatStyle.logo}
        source={require('../../assets/logo.png')}
      />
    </View>
  );

  const renderBubble = (props) => {
    return <Bubble {...props} wrapperStyle={ChatStyle.bubble} />;
  };

  const generateReply = (msg) => {
    replyIdx += 1;
    return {
      _id: replyIdx,
      text: msg,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Q&Aid',
        avatar:
          'https://cdn0.iconfinder.com/data/icons/avatar-2-3/450/23_avatar__woman_user-512.png',
      },
      seen: true,
    };
  };

  const onImageRequest = (img_src) => {
    replyIdx += 1;
    var msg = {
      _id: replyIdx,
      image: img_src,
      createdAt: new Date(),
      user: user_ctx.user,
      seen: true,
    };

    setMessages((previousMessages) => GiftedChat.append(previousMessages, msg));
  };

  const onReply = (cat) => {
    var msg = get_reply(cat);

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, generateReply(msg)),
    );
  };

  const isValidQuery = (input) => {
    if (input.length == 0) return 'invalid';
    if (input.trim().substr(-1) !== '?') return 'invalid';
    return 'valid';
  };

  const onQuestion = (query, cbk) => {
    if (ctx.state !== 'valid') {
      return cbk('error', 'invalid input');
    }

    models.vqa(ctx.image_value, query, function (err, answer) {
      if (err) {
        return cbk('error', err);
      }
      if (answer != null) {
        return cbk('hit', answer);
      }
      return cbk('miss', 'no data');
    });
  };

  const onSend = useCallback((messages = []) => {
    if (messages.length == 0) return;

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
    var query = messages[0].text;
    var status = isValidQuery(query);

    if (status !== 'valid') {
      return onReply('on_invalid_input');
    }

    setIsTyping(true);

    onQuestion(query, (status, data) => {
      console.log('VQA said ', status, data);
      setIsTyping(false);
      switch (status) {
        case 'hit': {
          return setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, generateReply(data)),
          );
        }
        default: {
          return onReply('on_miss');
        }
      }
    });
  }, []);

  return (
    <>
      <TopNavigation
        alignment="center"
        accessoryLeft={renderImagePicker}
        title={renderTitle}
        accessoryRight={renderOverflowMenuAction}
      />
      <GiftedChat
        useNativeDriver={true}
        messages={messages}
        isTyping={isTyping}
        onSend={(messages) => onSend(messages)}
        user={user_ctx.user}
        renderUsernameOnMessage
        renderBubble={renderBubble}
        showUserAvatar={true}
      />
    </>
  );
}
