# Multiple Gather from one Twilio Serverless Function
Example of how to use Studio to call a single Twilio Serverless Function (via TwiML Redirect Widget) to perform multiple <Gather> operations, and then route back to Studio Flow.

### Studio
The example Studio flow in this solution is very simple for demonstration purposes. 
  
  ![image](https://user-images.githubusercontent.com/67924770/157098497-7a982e33-0b93-4d8f-8084-5e20200cd997.png)

In the `redirect_to_func` TwiML Redirect Widget, we are sending the caller to a Twilio Function that performs 3 different <Gather> operations.

In the `checkReturnedData` widget, we do a "split based on" action with the data returned from the Twilio Function. This is to demonstrate how you can reference and use the returned Gather data from the Function. 
  
To easily set up a Studio Flow with the same configuration, take the JSON data in this file and [import it to your Studio Flow](https://www.twilio.com/docs/studio/user-guide#importing-flow-data).
  [Studio Flow JSON](https://github.com/bschinina-twilio/serverless-multiple-gather-redirect/blob/main/example-serverless-gather-twiml/assets/studio-flow.json)
  
### Function
This solution uses Twilio Serverless Functions. To learn more about these, please review this [documentation]9https://www.twilio.com/docs/runtime/functions).

From the Function, we are invoking three <Gather> operations:
  1. Gather the caller's dummy "account number"
  2. Gather the caller's "year of birth"
  3. Gather the caller's "consent" 
  
Each iteration through the Function will move the caller through to the next Gather step. On Gather complete, we will capture the data and re-run the Function with the next Gather request, until all 3 Gathers have been completed. 

Once we have all the data, this data will be returned back to Studio to perform further logic. 

### Benefits
This solution can be beneficial for the following requirements:
  -  Implement better security on Gathered data, like encryption. This allows for data to be gathered and processed securely (outside of Studio, since Studio is not PCI Compliant) and data returned back to Studio to coninue additional logic with encrypted data.
  - Reduce the number of Studio Widgets in a Flow
  
### Disclaimer
This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software.
