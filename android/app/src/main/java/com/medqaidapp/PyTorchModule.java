package com.medqaidapp;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;
import android.widget.TextView;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;

import org.pytorch.IValue;
import org.pytorch.Module;
import org.pytorch.Tensor;
import org.pytorch.torchvision.TensorImageUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import java.util.List;
import java.util.Scanner;
import java.util.ArrayList;
import java.nio.file.Paths;
import java.nio.file.Path;

public class PyTorchModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private Module module = null;

    public PyTorchModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "PyTorch";
    }

    @ReactMethod
    public void loadModel(final String modelPath, Promise promise) {
        try {
            // loading serialized torchscript module from packaged into app android asset model.pt,
            // app/src/assets/model.pt
            // String path = assetFilePath(this.reactContext, modelPath);
            //System.out.println("Current relative path is: " + path);
            module = Module.load(modelPath);

            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("model load failed", e);
        }
    }

    @ReactMethod
    public void predict(final String imagePath, Promise promise) {
        try {
            InputStream inputStream = new FileInputStream(imagePath.replace("file://", ""));
            Bitmap bitmap = BitmapFactory.decodeStream(inputStream);

            // preparing input tensor
            final Tensor inputTensor = TensorImageUtils.bitmapToFloat32Tensor(bitmap,
                TensorImageUtils.TORCHVISION_NORM_MEAN_RGB, TensorImageUtils.TORCHVISION_NORM_STD_RGB);

            // running the model
            final Tensor outputTensor = module.forward(IValue.from(inputTensor)).toTensor();

            // getting tensor content as java array of floats
            final float[] scores = outputTensor.getDataAsFloatArray();

            WritableArray result = Arguments.createArray();

            float maxScore = -Float.MAX_VALUE;
            int maxScoreIdx = -1;
            for (int i = 0; i < scores.length; i++) {
                if (scores[i] > maxScore) {
                    maxScore = scores[i];
                    maxScoreIdx = i;
                }
            }
            String className = ImageNetClasses.IMAGENET_CLASSES[maxScoreIdx];

            WritableMap row = Arguments.createMap();
            row.putString("label", className);
            result.pushMap(row);

            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("predict failed", e);
        }
    }

    /**
    * Copies specified asset to the file in /files app directory and returns this file absolute path.
    *
    * @return absolute file path
    */

    public static String assetFilePath(ReactApplicationContext context, String assetName) throws IOException {
      File file = new File(context.getFilesDir(), assetName);
      if (file.exists() && file.length() > 0) {
        return file.getAbsolutePath();
      }

      try (InputStream is = context.getAssets().open(assetName)) {
        try (OutputStream os = new FileOutputStream(file)) {
          byte[] buffer = new byte[4 * 1024];
          int read;
          while ((read = is.read(buffer)) != -1) {
            os.write(buffer, 0, read);
          }
          os.flush();
        }
        return file.getAbsolutePath();
      }
    }
}
