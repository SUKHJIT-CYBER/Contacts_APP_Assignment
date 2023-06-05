// web -> 688308235449-96rgm7lgdc4oot9euf5sqs1m688ie6bn.apps.googleusercontent.com
// android -> 688308235449-lqbo0kp2iqmlrgia8m3m3crsfb9hs198.apps.googleusercontent.com

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Modal } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as WebBrowser from 'expo-web-browser';
//import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-google-app-auth';
import * as GoogleSignIn from 'expo-google-sign-in';

import * as AuthSession from 'expo-auth-session';




const ContactItem = React.memo(({ contact, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.contactContainer}>
    <Text style={styles.contactName}>{contact.name}</Text>
    {contact.phoneNumbers && contact.phoneNumbers.length > 0 && (
      <Text style={styles.contactNumber}>{contact.phoneNumbers[0].number}</Text>
    )}
  </TouchableOpacity>
));

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });
      if (data.length > 0) {
        setContacts(data);
      }
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleContactPress = (contact) => {
    setSelectedContact(contact);
  };

  const handleModalDismiss = () => {
    setSelectedContact(null);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderContact = ({ item }) => (
    <ContactItem contact={item} onPress={() => handleContactPress(item)} />
  );

  const handleSignIn = async () => {
  try {
    await GoogleSignIn.initAsync({
      clientId: Platform.OS === 'android' ? '688308235449-lqbo0kp2iqmlrgia8m3m3crsfb9hs198.apps.googleusercontent.com' : '688308235449-96rgm7lgdc4oot9euf5sqs1m688ie6bn.apps.googleusercontent.com',
    });

    await GoogleSignIn.askForPlayServicesAsync();

    const { type, user } = await GoogleSignIn.signInAsync();

    if (type === 'success') {
      importContactsFromGoogle(user.auth.accessToken);
    } else {
      console.log('Google sign-in canceled');
    }
  } catch (error) {
    console.log('Error signing in with Google:', error);
  }
};



  const importContactsFromGoogle = async (accessToken) => {
  try {
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      pageSize: 100,
      pageOffset: 0,
      sort: Contacts.SortTypes.FirstName,
      rawContacts: true,
      shouldFetchImages: false,
    });

    if (data.length > 0) {
      setContacts(data);
    }
  } catch (error) {
    console.log('Error importing contacts from Google:', error);
  }
};


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search contacts..."
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        style={styles.contactsList}
      />
      <Modal visible={selectedContact !== null} onRequestClose={handleModalDismiss}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalName}>{selectedContact?.name}</Text>
          {selectedContact?.phoneNumbers && selectedContact.phoneNumbers.length > 0 && (
            <Text style={styles.modalNumber}>{selectedContact.phoneNumbers[0].number}</Text>
          )}
          <TouchableOpacity onPress={handleModalDismiss} style={styles.modalDismissButton}>
            <Text style={styles.modalDismissButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
        <Text style={styles.signInButtonText}>Sign In with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  contactsList: {
    flex: 1,
  },
  contactContainer: {
    marginBottom: 10,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactNumber: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalNumber: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  modalDismissButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  modalDismissButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    marginTop: 10,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
