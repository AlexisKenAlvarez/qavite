import { StyleSheet } from "react-native";

export const primaryColor = "#008400";
export const red = "#ef4444";

export const InputStyles = StyleSheet.create({
  isError: {
    borderColor: "#ef4444",
  },
  isValid: {
    borderColor: '#008400',
  },
  default: {
    width: "100%",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 100,
    paddingHorizontal: 28,
    fontSize: 18,
  },
  withIcon: {
    width: "100%",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 100,
    paddingRight: 28,
    paddingLeft: 48,
    fontSize: 18,
  },

  errorMessage: {
    marginLeft: 20,
    marginTop: 4,
    color: red,
  },
  icon: {
    position: "absolute",
    transform: [{ translateY: 15 }],
    top: 2,
    left: 24,
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
    opacity: 0.5,
  },
});

export const textStyles = StyleSheet.create({
  lg: {
    fontSize: 18,
  },
  xl: {
    fontSize: 20,
  },
  xl2: {
    fontSize: 24,
  },
  xl3: {
    fontSize: 30,
  },
  xl4: {
    fontSize: 36,
  },
  headerSans: {
    fontWeight: "bold",
    fontFamily: "DMSerifDisplay-Regular",
  },
});

export const styles = StyleSheet.create({
  signupHeader: {
    fontFamily: "DMSerifDisplay-Regular",
    color: "#008400",
    fontSize: 24,
  },

  authLayoutTab: {
    backgroundColor: "white",
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  roundButton: {
    borderRadius: 50,
    width: 44,
    height: 44,
    backgroundColor: primaryColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    backgroundColor: "white",
    height: "100%",
    padding: 24,
  },

  containerCenter: {
    backgroundColor: "white",
    height: "100%",
    padding: 24,
    display: "flex",
    justifyContent: "center",
  },

  button: {
    width: "100%",
    borderRadius: 100,
    paddingVertical: 12,
    backgroundColor: primaryColor,
    marginTop: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
