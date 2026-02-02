import mongoose from "mongoose";

const blogViewSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
  viewedAt: { type: Date, default: Date.now },
  ipAddress: String,
  type: String,
  continent: String,
  continent_code: String,
  country: String,
  country_code: String,
  region: String,
  region_code: String,
  city: String,
  latitude: Number,
  longitude: Number,
  is_eu: Boolean,
  postal: String,
  calling_code: String,
  capital: String,
  borders: String,

  // ✅ Flag info
  flag: {
    img: String,
    emoji: String,
    emoji_unicode: String,
  },

  // ✅ ISP connection info
  connection: {
    asn: Number,
    org: String,
    isp: String,
    domain: String,
  },

  // ✅ Timezone info
  timezone: {
    id: String,
    abbr: String,
    is_dst: Boolean,
    offset: Number,
    utc: String,
    current_time: String,
  },
});

const BlogView = mongoose.model("BlogView", blogViewSchema);
export default BlogView;
