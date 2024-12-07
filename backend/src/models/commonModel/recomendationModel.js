import { Schema, model } from "mongoose";

const recomendationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "baseUserModel", required: true },
  topicLiked: [{ type: Schema.Types.ObjectId, ref: "baseContentModel" }],
});

export default model("recomendationModel", recomendationSchema);

// hashtag
// when user more number click on specific hastag topic then create

// when user click a like or comment or hashtag they will id of that post
// they will store post id and user id

// topic wise ( quote  ) send api diff json data to user , ( using free api )
// or static QUOTEs database
