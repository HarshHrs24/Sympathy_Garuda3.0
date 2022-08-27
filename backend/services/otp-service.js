
const crypto = require('crypto');
const hashService = require('./hash-service');
const smsSid = 'AC963fefd75cbc3fa1863c1222f657fb9c';
const smsAuthToken ='b65f3d9087c273f69fd5bb567e212b13';
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
            from: '+17077304182',
            body: `Your Sympathy OTP is ${otp}`,
        });
    }
    verifyOtp(hashedOtp, data) {
        let computedHash = hashService.hashOtp(data);
        return computedHash === hashedOtp;
    }
}

module.exports = new OtpService();


