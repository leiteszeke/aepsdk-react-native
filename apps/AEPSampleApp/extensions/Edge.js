/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

@flow
@format
*/

import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, ScrollView} from 'react-native';
import {AEPEdge, AEPExperienceEvent} from '@adobe/react-native-aepedge';

export default Edge = ({ navigation }) => {

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Edge</Text>
        <Button title="extensionVersion()" onPress={edgeExtensionVersion}/>
        <Button title="sendEvent()" onPress={sendEvent}/>
        </ScrollView>
      </View>
  )
}

function edgeExtensionVersion() {
  AEPEdge.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPEdge version: " + version));
}

function sendEvent() {
  var xdmData  = {"eventType" : "SampleXDMEvent"};
  var data  = {"free": "form", "data": "example"};
  var experienceEvent = new AEPExperienceEvent(xdmData, data, "identifierValue");

  AEPEdge.sendEvent(experienceEvent);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 22,
    textAlign: 'center',
    margin: 10,
  }
});