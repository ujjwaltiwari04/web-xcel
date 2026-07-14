/**
 * Google Apps Script Web App Extension for WEBXcel Leads Collection
 * 
 * Instructions:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1GqX-eIom-ic0AVDGC6i_rRTLjBqdGMCDEBI4LGjbocw/edit
 * 2. Click on "Extensions" -> "Apps Script".
 * 3. Delete any default code in Code.gs and paste this code.
 * 4. Save the project (click the disk icon).
 * 5. Click "Deploy" -> "New deployment".
 * 6. Under "Select type", select "Web app".
 * 7. Configure:
 *    - Description: "WEBXcel Leads Web App"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (This is crucial to allow the web app to receive leads!)
 * 8. Click "Deploy" and authorize permissions if requested.
 * 9. Copy the generated "Web app URL" (it ends with /exec).
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Acquire a lock to prevent concurrent writing issues
    lock.waitLock(30000);
    
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": "No post data received" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    var jsonString = e.postData.contents;
    var data = JSON.parse(jsonString);
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1") || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    
    // Format Date Submitted in IST (Asia/Kolkata) timezone
    var dateSubmitted = data.createdAt ? new Date(data.createdAt) : new Date();
    var formattedDate = Utilities.formatDate(dateSubmitted, "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");
    
    var name = data.name || "";
    var location = data.location || "Not provided";
    var phone = data.phone || "";
    var email = data.email || "Not provided";
    
    // Look For / Plan Details
    var lookingFor = data.lookingFor || "";
    if (data.cart && data.cart.plan) {
      lookingFor = data.cart.plan;
    }
    
    // Format Cart ITEMS column
    var cartItemsText = "";
    if (data.cart) {
      var addonsStr = "None";
      if (data.cart.addons && data.cart.addons.length > 0) {
        addonsStr = data.cart.addons.map(function(a) {
          return a.label + " (" + a.price + ")";
        }).join(", ");
      }
      cartItemsText = "Plan: " + data.cart.plan + " (" + data.cart.planPrice + ")\nAddons: " + addonsStr + "\nTotal: " + data.cart.total;
    } else {
      cartItemsText = "No cart items (Initial Popup)";
    }
    
    var status = data.status || "New";
    
    // Append the row in exact columns matching:
    // A: Date Submitted | B: Name | C: Location | D: Phone Number | E: Email | F: Looking For | G: Cart ITEMS | H: Status
    sheet.appendRow([
      formattedDate,
      name,
      location,
      phone,
      email,
      lookingFor,
      cartItemsText,
      status
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success", "message": "Lead written successfully!" }))
                         .setMimeType(ContentService.MimeType.JSON)
                         .setHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON)
                         .setHeader("Access-Control-Allow-Origin", "*");
  } finally {
    lock.releaseLock();
  }
}

// Simple GET endpoint to test connectivity
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ "status": "active", "message": "WEBXcel Apps Script is ready to receive POST requests" }))
                       .setMimeType(ContentService.MimeType.JSON);
}

// Test function to dry-run the doPost in the Apps Script debugger
function testDoPost() {
  var dummyPayload = {
    postData: {
      contents: JSON.stringify({
        createdAt: new Date().toISOString(),
        name: "Dry Run Test",
        location: "Bengaluru",
        phone: "+91 99999 88888",
        email: "test_apps_script@example.com",
        lookingFor: "Starter Web Presence",
        cart: {
          plan: "Starter Web Presence",
          planPrice: "₹14,999",
          addons: [
            { label: "Premium Domain", price: "₹999" }
          ],
          total: "₹15,998"
        },
        status: "New"
      })
    }
  };
  var response = doPost(dummyPayload);
  Logger.log(response.getContent());
}
