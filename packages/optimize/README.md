
# React Native AEP Optimize Extension


`@adobe/react-native-aepoptimize` is a wrapper around the iOS and Android [Adobe Experience Platform Optimize Extension](https://aep-sdks.gitbook.io/docs/) to allow for integration with React Native applications.

## Prerequisites

The Adobe Experience Platform Optimize extension has the following peer dependency, which must be installed prior to installing the optimize extension:
- [Core](../core/README.md)
- [Edge](../edge/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page 

Download the `@adobe/react-native-aepoptimize` node package from the github pre-release and save it to a folder.
Install the `@adobe/react-native-aepoptimize` package:

```bash
cd MyReactApp
npm install {path to the node package}
```

Optimize native packages are not yet released. Additional setup needs to be done in Podfile and build.gradle for integrating RN Optimize package in your RN application.

**Podfile Setup**
The RN Optimize package depends on the AEPOptimize v1.0.0, which is not yet released. Clone AEPOptimize code from the [github repo]() in a folder.

```shell
git clone https://github.com/adobe/aepsdk-optimize-ios.git
```

Add the following pod dependency in your iOS project Podfile under the application target.

```
target 'MyReactApp' do  
pod 'AEPOptimize', :path => '{path to folder where AEPOptimize code was cloned}'
end
```

**Gradle setup**
In the Android project of RN application add the following under allProjects -> repositories

```groovy
flatDir {
dirs project(':adobe_react-native-aepmessaging').file('libs')
}
```

## Usage

### Initializing and registering the extension

Initialization of the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

Example:  

iOS  
```objectivec
@import AEPCore;
@import AEPLifecycle;
@import AEPEdge;
@import AEPOptimize;

@implementation AppDelegate
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [AEPMobileCore setLogLevel: AEPLogLevelTrace];
  [AEPMobileCore registerExtensions: @[AEPMobileEdge.class, AEPMobileOptimize.class] completion:^{
    [AEPMobileCore configureWithAppId:@"yourAppID"];
    [AEPMobileCore lifecycleStart:@{@"contextDataKey": @"contextDataVal"}];
  }
  ];
  return YES;
}
@end
```

Android  
```java
import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.InvalidInitException;
import com.adobe.marketing.mobile.Lifecycle;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.Edge;
import com.adobe.marketing.mobile.optimize.Optimize;
  
...
import android.app.Application;
...
public class MainApplication extends Application implements ReactApplication {
  ...
  @Override
  public void on Create(){
    super.onCreate();
    ...
    MobileCore.setApplication(this);
    MobileCore.setLogLevel(LoggingMode.DEBUG);
    try {
      Edge.registerExtension();
      Optimize.registerExtension();
      MobileCore.configureWithAppID("yourAppID");
      MobileCore.start(new AdobeCallback() {
        @Override
        public void call(Object o) {
          MobileCore.lifecycleStart(null);
        }
      });
    } catch (InvalidInitException e) {
      ...
    }
  }
}     
```

### Importing the extension:

```javascript
import { AEPOptimize, Offer, Proposition, DecisionScope } from '@adobe/react-native-aepoptimize';
```

## API reference

### Clearing the cached Propositions:

**Syntax**
```javascript
clearCachedPropositions()
```

**Example**
```javascript
AEPOptimize.clearCachedPropositions();
```

### Getting the SDK version:

**Syntax**
```javascript
extensionVersion(): Promise<string>
```

**Example**
```javascript
AEPOptimize.extensionVersion().then(newVersion => console.log("AdobeExperienceSDK: AEPOptimize version: " + newVersion);
```

### getting the cached propositions:
This API returns the cached propositions for the provided DecisionScopes from the in-memory Proposition cache.

**Syntax**
```javascript
getPropositions(decisionScopes: Array<DecisionScope>): Promise<Map<string, Proposition>>
```

**Example**
```javascript
const decisionScopeText = new DecisionScope("{DecisionScope name}");
const decisionScopeImage = new DecisionScope("{DecisionScope name}");
const decisionScopeHtml = new DecisionScope("{DecisionScope name{");
const decisionScopeJson = new DecisionScope("{DecisionScope name}");
const decisionScopes = [ decisionScopeText, decisionScopeImage, decisionScopeHtml, decisionScopeJson ];

AEPOptimize.getPropositions(decisionScopes).then(
   (propositions: Map<string, typeof Proposition>) => {
      //Your app logic using the propositions
});
```

### Adding onPropositionUpdate callback:
Callback that will be called with the updated Propositions.

**Syntax**
```javascript
onPropositionUpdate(adobeCallback: AdobeCallback)
```

**Example**
```javascript
AEPOptimize.onPropositionUpdate({
  call(proposition: Map<String, typeof Proposition>) {
    //App logic using the updated proposition
  }
});        
```

### updating the propositions:
This API fetches the propositions for the provided DecisionScope list.

**Syntax**
```javascript
updatePropositions(decisionScopes: Array<DecisionScope>, xdm: ?Map<string, any>, data: ?Map<string, any>)
```

**Example**
```javascript
const decisionScopeText = new DecisionScope("{DecisionScope name}");
const decisionScopeImage = new DecisionScope("{DecisionScope name}");
const decisionScopeHtml = new DecisionScope("{DecisionScope name{");
const decisionScopeJson = new DecisionScope("{DecisionScope name}");
const decisionScopes = [ decisionScopeText, decisionScopeImage, decisionScopeHtml, decisionScopeJson ];

AEPOptimize.updatePropositions(decisionScopes, null, null);
```

---

## Public classes

- [DecisionScope](#decisionscope)
- [Proposition](#proposition)
- [Offer](#offer)

### DecisionScope
This class represents the decision scope which is used to fetch the decision propositions from the Edge decisioning services. The encapsulated scope name can also represent the Base64 encoded JSON string created using the provided activityId, placementId and itemCount.

```javascript
/**
* class represents a decision scope used to fetch personalized offers from the Experience Edge network.
*/
export default class DecisionScope {
    name: string;        

    constructor(name: ?string, activityId: ?string, placementId: ?string, itemCount: ?number) {                
        if(name && name.trim()) {
            this.name = name;
        } else {            
            const decisionScopeObject = {};
            decisionScopeObject['activityId'] = activityId;            
            decisionScopeObject['placementId'] = placementId;    
            decisionScopeObject['itemCount'] = itemCount;   
            this.name = Buffer.from(JSON.stringify(decisionScopeObject)).toString("base64");            
        }                
    }

    /**
    * Gets the name of this scope
    * @return {string} - The name of the scope
    */
    getName(): string {
       return this.name; 
    }
};
```

### Proposition
This class represents the decision propositions received from the decisioning services, upon a personalization query request to the Experience Edge network.

```javascript
export default class Proposition {
    id: string;
    items: Array<Offer>;
    scope: string;
    scopeDetails: Object;

    constructor(eventData: Object) {
        this.id = eventData['id'];
        this.scope = eventData['scope'];
        this.scopeDetails = eventData['scopeDetails'];
        if(eventData['items']) {
            this.items = eventData['items'].map(offer => new Offer(offer, this));                
        }                
    }    
        
    /**
    * Generates a map containing XDM formatted data for {Experience Event - Proposition Reference} field group from proposition arguement.
    * The returned XDM data does not contain eventType for the Experience Event.     
    * @return {Promise<Map<string, any>>} a promise that resolves to xdm data map
    */
    generateReferenceXdm(): Promise<Map<string, any>> {
        const entries = Object.entries(this).filter(([key, value]) => typeof(value) !== "function");
        const proposition = Object.fromEntries(entries);    
        return Promise.resolve(RCTAEPOptimize.generateReferenceXdm(proposition));
    };
}
```

### Offer
This class represents the proposition option received from the decisioning services, upon a personalization query to the Experience Edge network.

```javascript
export default class Offer {
    id: string;
    etag: string;
    schema: string;
    data: Object;    
    proposition: Proposition;

    constructor(eventData: Object, proposition: Proposition) {
        this.id = eventData['id'];
        this.etag = eventData['etag'];
        this.schema = eventData['schema'];
        this.data = eventData['data'];                
        this.proposition = proposition;
    }

    /**
     * Gets the content of the Offer
     * @returns {string} - content of this Offer
     */
    getContent(): string {
        return this.data['content'];
    };

    /**
     * Gets the type of the Offer
     * @returns {string} - type of this Offer
     */
    getType(): string {
        return this.data['format'];
    };

    /**
    * Dispatches an event for the Edge network extension to send an Experience Event to the Edge network with the display interaction data for the
    * given Proposition offer.
    * @param {Proposition} proposition - the proposition this Offer belongs to
    */
    displayed(): void {
        const entries = Object.entries(this.proposition).filter(([key, value]) => typeof(value) !== "function");        
        const cleanedProposition = Object.fromEntries(entries);
        RCTAEPOptimize.offerDisplayed(this.id, cleanedProposition);
    };

    /**
    * Dispatches an event for the Edge network extension to send an Experience Event to the Edge network with the tap interaction data for the
    * given Proposition offer.
    * @param {Proposition} proposition - the proposition this Offer belongs to
    */
    tapped(): void {                
        const entries = Object.entries(this.proposition).filter(([key, value]) => typeof(value) !== "function");
        const cleanedProposition = Object.fromEntries(entries);
        RCTAEPOptimize.offerTapped(this.id, cleanedProposition);
    };

    /**
    * Generates a map containing XDM formatted data for {Experience Event - Proposition Interactions} field group from proposition arguement.
    * The returned XDM data does contain the eventType for the Experience Event with value decisioning.propositionDisplay.    
    * Note: The Edge sendEvent API can be used to dispatch this data in an Experience Event along with any additional XDM, free-form data, and override
    * dataset identifier.
    * @param {Proposition} proposition - the proposition this Offer belongs to
    * @return {Promise<Map<string, any>>} - a promise that resolves to xdm map
    */
    generateDisplayInteractionXdm(): Promise<Map<string, any>> {        
        const entries = Object.entries(this.proposition).filter(([key, value]) => typeof(value) !== "function");
        const cleanedProposition = Object.fromEntries(entries);
        return Promise.resolve(RCTAEPOptimize.generateDisplayInteractionXdm(this.id, cleanedProposition));        
    };   

    /**
    * Generates a map containing XDM formatted data for {Experience Event - Proposition Interactions} field group from this proposition arguement.    
    * The returned XDM data contains the eventType for the Experience Event with value decisioning.propositionInteract.    
    * Note: The Edge sendEvent API can be used to dispatch this data in an Experience Event along with any additional XDM, free-form data, and override
    * dataset identifier.    
    * @param {Proposition} proposition - proposition this Offer belongs to
    * @return {Promise<Map<string, any>>} a promise that resolves to xdm map
    */
    generateTapInteractionXdm(): Promise<Map<string, any>> {
        const entries = Object.entries(this.proposition).filter(([key, value]) => typeof(value) !== "function");
        const cleanedProposition = Object.fromEntries(entries);
        return Promise.resolve(RCTAEPOptimize.generateTapInteractionXdm(this.id, cleanedProposition));
    };   
}
```

