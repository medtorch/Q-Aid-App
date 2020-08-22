import React, { useRef, useState, useCallback, useEffect } from "react";
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
} from "@ui-kitten/components";
import { StyleSheet, View, Image, Alert, Linking } from "react-native";
import { ChatStyle } from "../../components";
import PhotoUpload from "react-native-photo-upload";

import { Auth } from "aws-amplify";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

import { templates, GetReplyContent, get_pretty_category } from "./data.js";
import {
  MenuIcon,
  InfoIcon,
  ShareIcon,
  LogoutIcon,
  PhotoIcon,
  HeartIcon,
  LightIcon,
} from "./icons.js";
import { ChatContext } from "./context.js";
import { User } from "./user.js";
import { Models } from "./models.js";
import { CreateAlert } from "./utils.js";
import { Wiki } from "./wiki.js";
import { PDFGenerator } from "./pdf.js";

var replyIdx = 1;
var ctx = new ChatContext();
var user_ctx = new User();
var models = new Models();
var wiki = new Wiki();
var pdf = new PDFGenerator();

export function Main() {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    user_ctx.load();
    setMessages([generateReply(GetReplyContent("intro"))]);
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
        onBackdropPress={toggleMenu}
      >
        <MenuItem
          accessoryLeft={LightIcon}
          title="Motivation"
          onPress={() => {
            Linking.openURL("https://github.com/medtorch/Q-Aid-Motivation");
          }}
        />
        <MenuItem
          accessoryLeft={HeartIcon}
          title="Models"
          onPress={() => {
            Linking.openURL("https://github.com/medtorch/Q-Aid-Models");
          }}
        />
        <MenuItem
          accessoryLeft={InfoIcon}
          title="About"
          onPress={() => {
            Linking.openURL("https://github.com/medtorch/Q-Aid-Core");
          }}
        />
        <MenuItem accessoryLeft={ShareIcon} title="Print" />
        <MenuItem
          accessoryLeft={LogoutIcon}
          title="Logout"
          onPress={user_ctx.signOut}
        />
      </OverflowMenu>
    </React.Fragment>
  );

  const onPhotoUpload = async (file) => {
    if (file.error || typeof file.uri == "undefined") {
      console.log("failed to load file ", file);
      return;
    }
    ctx.reset();
    ctx.on_source(file.uri);
  };

  const handlePrefilter = async () => {
    setIsTyping(true);

    if (ctx.topic) {
      var template = GetReplyContent("on_upload");
      template = template.replace("%s", ctx.topic);

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, generateReply(template))
      );
    }

    await new Promise((r) => setTimeout(r, 1000));

    if (ctx.total_sources == 0) {
      setMessages((previousMessages) =>
        GiftedChat.append(
          previousMessages,
          generateReply(GetReplyContent("on_no_hip"))
        )
      );
      setIsTyping(false);
      return;
    }

    if (ctx.anomalies.total_sources == 0) {
      var template = GetReplyContent("on_hip_no_anomalies");
      template = template.replace("%s", ctx.total_sources);

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, generateReply(template))
      );
      setIsTyping(false);
      return;
    }

    var template = GetReplyContent("on_hip_anomalies");
    template = template.replace("%s", ctx.anomalies.total_sources);
    template = template.replace("%s", ctx.total_sources);

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, generateReply(template))
    );

    await new Promise((r) => setTimeout(r, 1000));

    var template = GetReplyContent("on_prefilter_anomaly");
    template = template.replace("%s", ctx.anomalies["what"]);
    template = template.replace("%s", ctx.anomalies["where"]);
    template = template.replace("%s", ctx.anomalies["why"]);

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, generateReply(template))
    );

    await new Promise((r) => setTimeout(r, 1000));
    wiki.ask(ctx.anomalies["why"], (err, explanation) => {
      setIsTyping(false);
      if (err) {
        return;
      }
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, generateReply(explanation))
      );
    });
  };

  const onPhotoSelect = (bs64img) => {
    setMessages([generateReply(GetReplyContent("intro"))]);
    onImageRequest(ctx.source.uri);
    setIsTyping(true);

    models.prefilter(bs64img, function (err, answer) {
      setIsTyping(false);
      if (err) {
        console.log("prefilter failed ", err);
        CreateAlert(templates.messages.on_error);
        return;
      }
      ctx.on_prefilter(bs64img, answer);

      if (!ctx.valid) {
        CreateAlert(templates.messages.on_invalid_input);
        return;
      }
      return handlePrefilter();
    });

    models.segmentation(bs64img, function (err, answer) {
      if (err) {
        console.log("segmentation failed ", err);
        return;
      }
      console.log("got segmentation ", answer);
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
          onBackdropPress={() => setModalVisible(false)}
        >
          <Card disabled={true}>
            <PhotoUpload
              onResponse={onPhotoUpload}
              onPhotoSelect={onPhotoSelect}
            >
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
        source={require("../../assets/logo.png")}
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
        name: "Q&Aid",
        avatar:
          "https://cdn0.iconfinder.com/data/icons/avatar-2-3/450/23_avatar__woman_user-512.png",
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
    var msg = GetReplyContent(cat);

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, generateReply(msg))
    );
  };

  const queryType = (input) => {
    if (input.length == 0) return "invalid";
    if (input.toLowerCase().startsWith("define")) return "wiki";
    if (input.trim().substr(-1) === "?") return "vqa";
    return "invalid";
  };

  const onQuestion = (query, cbk) => {
    if (!ctx.valid) {
      return cbk("error", "invalid input");
    }

    models.vqa(ctx.image_value, query, function (err, answer) {
      if (err) {
        return cbk("error", err);
      }
      if (answer != null) {
        return cbk("hit", answer);
      }
      return cbk("miss", "no data");
    });
  };

  const handleRequest = (query) => {
    var type = queryType(query);

    setIsTyping(true);
    switch (type) {
      case "vqa": {
        onQuestion(query, (status, data) => {
          setIsTyping(false);
          switch (status) {
            case "hit": {
              console.log("got vqa data ", data);
              if (!data.total || !data.data) {
                return setMessages((previousMessages) =>
                  GiftedChat.append(
                    previousMessages,
                    generateReply(GetReplyContent("on_empty_vqa"))
                  )
                );
              }

              var template = GetReplyContent("on_vqa");
              template = template.replace("%s", data.total);
              template = template.replace("%s", data.data);

              return setMessages((previousMessages) =>
                GiftedChat.append(previousMessages, generateReply(template))
              );
            }
            default: {
              return onReply("on_miss");
            }
          }
        });
        break;
      }
      case "wiki": {
        var term = query.toLowerCase().split("define")[1].trim();
        wiki.ask(term, (err, message) => {
          setIsTyping(false);
          return setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, generateReply(message))
          );
        });
        break;
      }
      default: {
        setIsTyping(false);
        return onReply("on_invalid_input");
      }
    }
  };

  const onSend = useCallback((messages = []) => {
    if (messages.length == 0) return;

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    var query = messages[0].text;
    handleRequest(query);
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
