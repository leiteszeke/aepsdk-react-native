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

'use strict';

const RCTAEPIdentity = require('react-native').NativeModules.AEPIdentity;

import type { VisitorID } from './models/VisitorID';

module.exports = {
  /**
   * Returns the version of the AEPIdentity extension
   * @param  {string} Promise a promise that resolves with the extension verison
   */
  extensionVersion(): Promise<string> {
    return Promise.resolve(RCTAEPIdentity.extensionVersion());
  },

  /**
   * @brief Updates the given customer IDs with the Adobe Experience Cloud ID Service.
   *
   * Synchronizes the provided customer identifiers to the Adobe Experience Cloud ID Service.
   * If a customer ID type matches an existing ID type, then it is updated with the new ID value
   * and authentication state. New customer IDs are added. All given customer IDs are given the default
   * authentication state of \ref ADBMobileVisitorAuthenticationStateUnknown.
   *
   * These IDs are preserved between app upgrades, are saved and restored during the standard application backup process,
   * and are removed at uninstall.
   *
   * If the current SDK privacy status is \ref PrivacyStatusOptOut, then this operation performs no action.
   *
   * @param identifiers a dictionary of customer IDs
   * @see PrivacyStatus
   */
  syncIdentifiers(identifiers?: { string: string }) {
    RCTAEPIdentity.syncIdentifiers(identifiers);
  },

  /**
   * @brief Updates the given customer IDs with the Adobe Experience Cloud ID Service.
   *
   * Synchronizes the provided customer identifiers to the Adobe Experience Cloud ID Service.
   * If a customer ID type matches an existing ID type, then it is updated with the new customer ID value
   * and authentication state. New customer IDs are added.
   *
   * These IDs are preserved between app upgrades, are saved and restored during the standard application backup process,
   * and are removed at uninstall.
   *
   * If the current SDK privacy status is \ref PrivacyStatusOptOut, then this operation performs no action.
   *
   * @param identifiers a dictionary of customer IDs
   * @param authenticationState a valid \ref MobileVisitorAuthenticationState value.
   * @see PrivacyStatus
   */
  syncIdentifiersWithAuthState(identifiers?: { string: string }, authenticationState: string) {
    RCTAEPIdentity.syncIdentifiersWithAuthState(identifiers, authenticationState);
  },

  /**
   * @brief Updates the given customer ID with the Adobe Experience Cloud ID Service.
   *
   * Synchronizes the provided customer identifier type key and value with the given
   * authentication state to the Adobe Experience Cloud ID Service.
   * If the given customer ID type already exists in the service, then
   * it is updated with the new ID and authentication state. Otherwise a new customer ID is added.
   *
   * This ID is preserved between app upgrades, is saved and restored during the standard application backup process,
   * and is removed at uninstall.
   *
   * If the current SDK privacy status is \ref PrivacyStatusOptOut, then this operation performs no action.
   *
   * @param identifierType    a unique type to identify this customer ID
   * @param identifier        the customer ID to set
   * @param authenticationState a valid \ref MobileVisitorAuthenticationState value.
   * @see PrivacyStatus
   */
  syncIdentifier(identifierType: String, identifier: String, authenticationState: string) {
    RCTAEPIdentity.syncIdentifier(identifierType, identifier, authenticationState);
  },

  /**
   * @brief Appends visitor information to the given URL.
   *
   * If the given url is nil or empty, it is returned as is. Otherwise, the following information is added to the query section of the given URL.
   * The attribute `adobe_mc` is an URL encoded list containing the Experience Cloud ID, Experience Cloud Org ID, and a timestamp when this request
   * was made. The attribute `adobe_aa_vid` is the URL encoded Visitor ID, however the attribute is only included
   * if the Visitor ID was previously set.
   *
   * @param baseUrl URL to which the visitor info needs to be appended. Returned as is if it is nil or empty.
   * @param promise method which will be invoked once the updated url is available.
   */
  appendVisitorInfoForURL(baseURL?: String): Promise<?string> {
    return RCTAEPIdentity.appendVisitorInfoForURL(baseURL);
  },

  /**
   * @brief Returns visitor information in URL query string form for consumption in hybrid mobile apps.
   *
   * Retrieves the visitor identifiers as a URL query parameter string.
   * There will be no leading '&' or '?' punctuation, as the caller is responsible for placing the string in the correct
   * location of their resulting URL. If there is not a valid URL string to return, or if an error occurs, callback will
   * contain nil. Otherwise, the following information is added to the query section of the given URL.
   * The attribute `adobe_mc` is an URL encoded list containing the Experience Cloud ID, Experience Cloud Org ID,
   * Analytics Tracking ID if available from Analytics, and a timestamp when this request
   * was made. The attribute `adobe_aa_vid` is the URL encoded Analytics Customer Visitor ID, if previously set in
   * Analytics extension.
   *
   * @param promise method which will be invoked once the url query parameter string is available.
   */
  getUrlVariables(): Promise<?string> {
    return RCTAEPIdentity.getUrlVariables();
  },

  /**
   * @brief Returns all customer identifiers which were previously synced with the Adobe Experience Cloud.
   *
   * @param callback method which will be invoked once the customer identifiers are available.
   * @see AEPIdentity::syncIdentifier:identifier:authentication:
   * @see AEPIdentity::syncIdentifiers:
   */
  getIdentifiers(): Promise<Array<?VisitorID>> {
    return RCTAEPIdentity.getIdentifiers();
  },

  /**
   * @brief Returns the Experience Cloud ID.
   *
   * The Experience Cloud ID is generated at initial launch and is stored and used from that point forward.
   * This ID is preserved between app upgrades, is saved and restored during the standard application backup process,
   * and is removed at uninstall.
   *
   * @param callback method which will be invoked once Experience Cloud ID is available.
   */
  getExperienceCloudId(): Promise<?string> {
    return RCTAEPIdentity.getExperienceCloudId();
  },

};
