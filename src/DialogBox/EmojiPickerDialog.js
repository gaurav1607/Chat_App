import React, { useState } from "react";
import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  EmojiClickData,
  Emoji,
  SuggestionMode,
  SkinTonePickerLocation,
  PreviewConfig,
} from "emoji-picker-react";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import { useChatContext } from "../Context/ChatContext";

export const EmojiPickerDialog = () => {
  const [inputValue, setInputValue] = useState("");
  const {  emoji,message, dispatch } = useChatContext();


  function onClick(emojiData, event) {
    console.log("Emoji Data:", emojiData);
    dispatch({ type: "SET_EMOJI", payload: emojiData.emoji });
    dispatch({type:"SET_MESSAGE", payload: message + emojiData.emoji})
  }
  

  return (
    <EmojiPicker
      onEmojiClick={onClick}
      autoFocusSearch={false}
      // emojiStyle={EmojiStyle.NATIVE}
      previewConfig={{
        showPreview: false,
      }}
    />
  );
};
