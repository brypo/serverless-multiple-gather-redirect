/*

This Function is an example of how we can perform multiple GATHER operations and route back to Studio.

Three "gather" actions are performed:
- get account number
- get year of birth
- get consent (1 = yes)

Once all three gathers are completed, it will:
- perform simple logic on the data
- pass the processed data back to Studio using a REDIRECT

*/

exports.handler = function (context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  const functionName = "multiple-gather-twiml"; //set this to the name of your function
  const functionUrl = `https://${context.DOMAIN_NAME}/${functionName}`;

  const flowStep = event.flowStep.toString();
  const flowSid = event.flowSid.toString();

  switch (flowStep) {
      case ("getAccountNumber"):
          //first gather step
          getAccountNumber(twiml, functionUrl, flowSid);
          break;
      case ("getYearOfBirth"):
          //second gather step
          getYearOfBirth(twiml, event.Digits, functionUrl, flowSid);
          break;
      case ("getConsent"):
          //third gather step
          getConsent(twiml, event.accountNumber.toString(), event.Digits, functionUrl, flowSid);
          break;
      default:
          //final processing step - hand back to Studio
          processGatheredData(twiml, event.accountNumber.toString(), event.yearOfBirth.toString(), event.Digits, context, flowSid);

  }
  return callback(null, twiml);
};

// gather dummy account number
// this "action" url is configured to this same function and  will be called on gather complete
// the query string data will: (1) set next switch/case step, (2) add gathered data
const getAccountNumber = (twiml, functionUrl, flowSid) => {
  const gather = twiml.gather({
      action: `${functionUrl}?flowStep=getYearOfBirth&flowSid=${flowSid}`, //call this same function when gather complete
      method: 'POST',
      input: 'dtmf',
      timeout: 12,
      numDigits: 6
  });
  gather.say('Please enter your 6 digit account number.');

  return gather;
}

// gather dummy year of birth
const getYearOfBirth = (twiml, accountNumber, functionUrl, flowSid) => {
  const gather = twiml.gather({
      action: `${functionUrl}?flowStep=getConsent&accountNumber=${accountNumber.toString()}&flowSid=${flowSid}`, 
      method: 'POST',
      input: 'dtmf',
      timeout: 8,
      numDigits: 4
  });
  gather.say('Please enter the year you were born.');

  return gather;

}

// gather dummy consent (1 = YES)
const getConsent = (twiml, accountNumber, yearOfBirth, functionUrl, flowSid) => {
  const gather = twiml.gather({
      action: `${functionUrl}?flowStep=finish&accountNumber=${accountNumber.toString()}&yearOfBirth=${yearOfBirth.toString()}&flowSid=${flowSid}`, //on gather complete, add more data, repeat loop through this function
      method: 'POST',
      input: 'dtmf',
      timeout: 3,
      numDigits: 1
  });
  gather.say('Press 1 to give your consent.');

  return gather;
}

// perform logical processing with the data and then return it back to Studio
const processGatheredData = (twiml, accountNumber, yearOfBirth, consent, context, flowSid) => {
  //function to check if age > 17 based on birth year
  const validateAge = (yearOfBirth) => {
    let now = new Date().getFullYear();
    let adult = (now - parseInt(yearOfBirth) > 17) ? 'true' : 'false';
    return adult;
  }

  //set a variable called isAdult 
  let isAdult = validateAge(yearOfBirth);
  let resultString = `accountNumber=${accountNumber}&isAdult=${isAdult}&consent=${consent}`

  //info logging
  console.log(`Result to send to Studio: ${resultString}`)

  return twiml.redirect({
      method: 'POST'
  }, `https://webhooks.twilio.com/v1/Accounts/${context.ACCOUNT_SID}/Flows/${flowSid}?FlowEvent=return&${resultString}`);
}
