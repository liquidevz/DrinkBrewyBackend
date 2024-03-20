const getBlurDataURL = async (url) => {
  if (!url) {
    return null;
  }
  const prefix = "https://res.cloudinary.com/dcuwtg4h1/image/upload/";
  const suffix = url.split(prefix)[1];
  const response = await fetch(
    `${prefix}w_100,e_blur:5000,q_auto,f_auto/${suffix}`,
  );
  const buffer = await response.arrayBuffer();
  // eslint-disable-next-line no-undef
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:image/png;base64,${base64}`;
};
// eslint-disable-next-line no-undef
module.exports = getBlurDataURL;
