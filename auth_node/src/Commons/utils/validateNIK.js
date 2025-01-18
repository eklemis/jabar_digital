const validateNIK = (NIK) => {
  const regex = /^\d{16}$/;
  return regex.test(NIK);
};

module.exports = validateNIK;
