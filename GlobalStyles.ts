import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  profileTitle: {
    fontSize: 24,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '100',
  },

  input: {
    height: 40,
    width: '80%',
    marginLeft: '10%',
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  verifyUserPasscodeInput: {
    height: 40,
    width: '80%',
    marginLeft: '10%',
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    textAlign: 'center',
  },
  fridgePopupInput: {
    backgroundColor: '#ccc',
    color: '#000',
    marginBottom: 8,
    padding: 2,
    minWidth: '85%',
    textAlign: 'center',
    fontWeight: '500',
  },
  inputLabel: {
    fontWeight: '600',
    fontSize: 18,
    color: '#fff',
    marginTop: 5,
    marginBottom: 0,
  },

  popupContainer: {
    marginTop: 50,
    padding: 20,
    backgroundColor: 'black',
    alignItems: 'center',
    minHeight: '60%',
  },

  fridgePopupTitle: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '500',
  },

  popupInputTitle: {
    color: '#fff',
  },
  popupInput: {
    minWidth: '80%',
    backgroundColor: 'white',
    padding: 8,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    alignItems: 'center',
    borderRadius: 4,
    width: '80%',
    marginLeft: '10%',
    marginBottom: '2%',
    margin: 6,
  },
  submitButtonText: {
    color: 'black',
    fontSize: 14,
  },
  expiryDateText: {
    fontSize: 14,
    marginLeft: 20, // for example
  },
  expiryDateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: 10,
    marginLeft: 20,
  },

  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  fridgeContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },

  fridgeItem: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  registerButton: {
    backgroundColor: '#000',
    padding: 10,
    alignItems: 'center',
    borderRadius: 4,
    width: '80%',
    marginLeft: '10%',
    marginBottom: '2%',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    borderRadius: 4,
    width: '80%',
    marginLeft: '10%',
    marginBottom: '2%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 50,
  },

  bottomNav: {
    position: 'absolute', // use absolute positioning
    bottom: 0, // position at the bottom of the screen
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // use full width of the screen
    padding: 10, // add some padding around the buttons
    backgroundColor: '#f8f8f8', // optional: add a background color
  },
  navButton: {
    flex: 1, // this ensures that the buttons take up equal amounts of space
    marginHorizontal: 5, // add some margin between the buttons
    backgroundColor: 'orange',
    fontWeight: 'bold',
    alignItems: 'center', // added to center the contents
    justifyContent: 'center', // added to center the contents
    padding: 10, // added to give some space around the contents
  },

  contentButtons: {
    width: 80,
  },
  homeMenu: {position: 'absolute', right: 9, top: 10},

  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },

  logo: {
    width: 150,
    height: 150,
  },
  form: {
    width: '100%',
  },

  buttonSeparator: {
    margin: 20,
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 40,
    fontWeight: 'bold',
  },
  error: {color: '#FF8C00'},

  // Add the following styles to your stylesheet

  navIcon: {
    width: 30,
    height: 30,
  },
  image: {
    width: '100%', // Take the full width of the container
    aspectRatio: 1, // This will keep the image's height proportional to its width.
    borderWidth: 1,
    borderColor: 'black',
  },
  title: {
    width: '100%',
    fontWeight: 'bold',
    overflow: 'hidden',
  },

  groupTwoButtons: {
    margin: 16,
  },

  hideBarcodeandISBN: {
    color: 'white',
    fontSize: 1,
  },

  productPageItemtitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },

  itemContainer: {
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '30%', // stops non multiple of 3 boxes resizing bigger than wanted.
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  // Styles for the buttons
  button: {
    backgroundColor: '#FF8C00',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  // Styles for the button text
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  profileLogo: {
    marginBottom: 10,
    alignItems: 'center',
  },

  profileText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
