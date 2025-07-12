const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
};

export default generateOtp;