
const crypto = require('crypto');
const hashService = require('./hash-service');
const smsSid = '';
const smsAuthToken ='';
const twilio = require('twilio')(smsSid, smsAuthToken, {
    lazyLoading: true,
});


class OtpService{

    async generateOtp(){
        const otp= crypto.randomInt(1000,9999);
        return otp;
    }
    async sendBySms(phone, otp) {
        return await twilio.messages.create({
            to: phone,
            from: ' ',
            body: `Your Sympathy OTP is ${otp}`,
        });
    }
    verifyOtp(hashedOtp, data) {
        let computedHash = hashService.hashOtp(data);
        return computedHash === hashedOtp;
    }
}

module.exports = new OtpService();


