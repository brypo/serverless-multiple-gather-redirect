# Multiple Gather from one Twilio Serverless Function
Example of how to use Studio to call a single Twilio Serverless Function (via TwiML Redirect Widget) to perform multiple `<Gather>` operations, and then route back to Studio Flow.

![image](https://user-images.githubusercontent.com/67924770/157148508-b6aff2c0-d13f-4acb-85be-c32c194fa0f2.png)


### Studio
The example Studio flow in this solution is very simple for demonstration purposes. 
  
![image](https://user-images.githubusercontent.com/67924770/157103316-0f58e622-3e4e-4822-ae9c-aff43596f95c.png)

In the `redirect_to_func` TwiML Redirect Widget, we are sending the caller to a Twilio Function that performs 3 different `<Gather>` operations. We supply the Redirect URL with the following query string paramaters:
  - Studio Flow SID (`flow.flow_sid`)
  - First `Gather` step defined in the Twilio Function (`getAccountNumber`)
  
  Full example URL:
  `https://YOUR_DOMAIN.twil.io/YOUR_PATH?flowSid={{flow.flow_sid}}&flowStep=getAccountNumber`

In the `checkReturnedData` widget, we do a "split based on" action with the data returned from the Twilio Function. This is to demonstrate how you can reference and use the returned Gather data from the Function. 
  
To easily set up a Studio Flow with the same configuration, take the JSON data in this file and [import it to your Studio Flow](https://www.twilio.com/docs/studio/user-guide#importing-flow-data).

  [Studio Flow JSON](https://github.com/bschinina-twilio/serverless-multiple-gather-redirect/blob/main/example-serverless-gather-twiml/assets/studio-flow.json)
  
### Function
This solution uses Twilio Serverless Functions. To learn more about these, please review this [documentation](https://www.twilio.com/docs/runtime/functions).

From the Function, we are invoking three `<Gather>` operations:
  1. Gather the caller's dummy "account number"
  2. Gather the caller's "year of birth"
  3. Gather the caller's "consent" 
  
Each iteration through the Function will move the caller through to the next Gather step. On Gather complete, we will capture the data and re-run the Function with the next Gather request, until all 3 Gathers have been completed. 

Once we have all the data, this data will be returned back to Studio to perform further logic. 
  
In this example, we return the following data to Studio:
  - Account Number
  - isAdult boolean value (determined by "year of birth" data)
  - Consent (1 = YES)

### Benefits
This solution can be beneficial for the following requirements:
  -  Implement better security on Gathered data, like encryption. This allows for data to be gathered and processed securely (outside of Studio, since Studio is not PCI Compliant) and then have data returned back to Studio to coninue additional logic with encrypted data.
  - Reduce the number of Studio Widgets in a Flow
  
### Disclaimer
This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software.
