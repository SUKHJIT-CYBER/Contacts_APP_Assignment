import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Image, TextInput, FlatList, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Contacts from 'expo-contacts';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
    const [userInfo, setUserInfo] = useState(null);
    const [googleContacts, setGoogleContacts] = useState([]);
    const [phoneContacts, setPhoneContacts] = useState([]);
    const [allContacts, setAllContacts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: "688308235449-96rgm7lgdc4oot9euf5sqs1m688ie6bn.apps.googleusercontent.com",
        androidClientId: "688308235449-lqbo0kp2iqmlrgia8m3m3crsfb9hs198.apps.googleusercontent.com",
        iosClientId: "",
        webClientId: "688308235449-96rgm7lgdc4oot9euf5sqs1m688ie6bn.apps.googleusercontent.com",
        scopes: ['profile', 'email', 'https://www.googleapis.com/auth/contacts.readonly', 'https://www.googleapis.com/auth/user.phonenumbers.read', 'https://www.googleapis.com/auth/contacts'],
    });

    useEffect(() => {
        handleEffect();
    }, [response]);

    async function handleEffect() {
        if (response?.type === "success") {
            getGoogleContacts(response.authentication.accessToken);
        }
    }

    const getUserInfo = async (token) => {
        if (!token) return;
        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const user = await response.json();
            setUserInfo(user);
        } catch (error) {
            // Add your own error handler here
        }
    };

    const getGoogleContacts = async (token) => {
        if (!token) return;
        try {
            const response = await fetch(
                "https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await response.json();
            if (data.connections) {
                setGoogleContacts(data.connections.map(connection => ({
                    name: connection.names[0].displayName,
                    phoneNumbers: connection.phoneNumbers ? [{ number: connection.phoneNumbers[0].canonicalForm }] : [],
                })));
            }
        } catch (error) {
            // Add your own error handler here
        }
    };

    const getPhoneContacts = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
            // Handle permission denied
            return;
        }

        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
            setPhoneContacts(data);
        }
    };

    useEffect(() => {
        if (searchText === '') {
            setFilteredContacts(allContacts);
        } else {
            setFilteredContacts(allContacts.filter(contact => contact.name.toLowerCase().includes(searchText.toLowerCase())));
        }
    }, [searchText, allContacts]);

    useEffect(() => {
        setAllContacts([...googleContacts, ...phoneContacts]);
    }, [googleContacts, phoneContacts]);

    useEffect(() => {
        if (response?.type === "success") {
            getUserInfo(response.authentication.accessToken);
        }
    }, [response]);

    useEffect(() => {
        getPhoneContacts();
    }, []);

    return (
        <View style={styles.container}>
            <Text>Import My Contacts From Google </Text>
            {!userInfo ? (
                <Button
                    title="Sign in with Google"
                    disabled={!request}
                    onPress={() => promptAsync()}
                />
            ) : (
                <View style={styles.card}>
                    {userInfo?.picture && (
                        <Image source={{ uri: userInfo?.picture }} style={styles.image} />
                    )}
                    <Text style={styles.text}>Email: {userInfo.email}</Text>
                    <Text style={styles.text}>
                        Verified: {userInfo.verified_email ? "yes" : "no"}
                    </Text>
                    <Text style={styles.text}>Name: {userInfo.name}</Text>
                </View>
            )}

            <View style={styles.contentContainer}>
                <TextInput
                    placeholder="Search"
                    onChangeText={text => setSearchText(text)}
                    style={styles.searchInput}
                />
                <FlatList
                    data={filteredContacts}
                    keyExtractor={(item, index) => `${item.name}-${index}`}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setSelectedContact(item)}>
                            <View style={styles.contactContainer}>
                                <Text style={styles.contactName}>{item.name}</Text>
                                {item.phoneNumbers && item.phoneNumbers[0] && (
                                    <Text style={styles.contactNumber}>{item.phoneNumbers[0].number}</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {selectedContact && (
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalContactName}>{selectedContact.name}</Text>
                        {selectedContact.phoneNumbers && selectedContact.phoneNumbers[0] && (
                            <Text style={styles.modalContactNumber}>{selectedContact.phoneNumbers[0].number}</Text>
                        )}
                        <TouchableOpacity onPress={() => setSelectedContact(null)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "flex-start", // Align items to the left
        justifyContent: "flex-start", // Align items to the top
        paddingTop: 50, // Add margin from the top
        paddingHorizontal: 20, // Add horizontal padding
        //borderRadius: 140,
        elevation: 10
    },

    card: {
        borderWidth: 1,
        borderRadius: 40,
        padding: 15,
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    contactContainer: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    contactName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    contactNumber: {
        fontSize: 14,
        color: 'gray',
    },
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalContactName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalContactNumber: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        marginTop: 20, // Add margin from the top
        width: '100%', // Occupy the full width
    },
    searchInput: {
        height: 40,
        width:250,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 10,
        borderRadius:40
    },

});
