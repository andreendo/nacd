let model: Array<AsyncClass>;

interface AsyncClass {
    name: String;
    is?: Array<String>;             // string must be the name of an existing AsyncClass
    properties?: Array<Property>;
}

interface Property {
    name: String;
    optionalProperty: Boolean;      
    types: Array<CodePattern>;
    postponeRegistration: Boolean;
    connectedCallbacks: Boolean;
    returnedObject?: String;            // string must be the name of an existing AsyncClass
    AsyncObjectProperty?: String;       // string must be the name of an existing AsyncClass
    callbackObjects?: Array<String>;    // string must be the name of an existing AsyncClass
    eventSpecificObjects?: Array<EventSpecificObject>;
}

enum CodePattern {
    CB,     // simple callback
    RO,     // returned object
    OC,     // object creation
    OP,     // object property
    CO,     // callback object
    RP      // returned promise
}

interface EventSpecificObject {
    event: String;
    callbackObjects: Array<String>;     // string must be the name of an existing AsyncClass
}