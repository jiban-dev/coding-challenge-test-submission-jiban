import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import useFormFields from "@/hooks/useFormFields";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import transformAddress from "./core/models/address";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */
  /* Implemented custom hook - Jiban */
  const [loading, setLoading] = React.useState(false);
  const { fields, onFieldChange, resetFields } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });

  //const [postCode, setPostCode] = React.useState("");
  //const [houseNumber, setHouseNumber] = React.useState("");
  //const [firstName, setFirstName] = React.useState("");
  //const [lastName, setLastName] = React.useState("");
  //const [selectedAddress, setSelectedAddress] = React.useState("");
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /**
   * Text fields onChange handlers
   */
  // const handlePostCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  //   setPostCode(e.target.value);

  // const handleHouseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  //   setHouseNumber(e.target.value);

  // const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  //   setFirstName(e.target.value);

  // const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  //   setLastName(e.target.value);

  // const handleSelectedAddressChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => setSelectedAddress(e.target.value);

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */

  //Implemented - fetch addresses based on houseNumber and postCode - Jiban
  const handleAddressSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset previous search
    setAddresses([]);
    setError(undefined);

    const { postCode, houseNumber } = fields;

    if (!postCode || !houseNumber) {
      setError("Postcode and house number are required");
      return;
    }

    try {
      setLoading(true);

      const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

      const response = await fetch(
        `${BASE_URL}/api/getAddresses?postcode=${postCode}&streetnumber=${houseNumber}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data = await response.json();

      const transformedAddresses = data.details.map((address: any) =>
        transformAddress({
          ...address,
          houseNumber,
        })
      );
      setAddresses(transformedAddresses);

    } catch (err) {
      setError("Something went wrong while fetching addresses");
    } finally {
      setLoading(false);
    }

  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fields.selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }
    const { firstName, lastName } = fields
    const foundAddress = addresses.find(
      (address) => address.id === fields.selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName, lastName });
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <form onSubmit={handleAddressSubmit}>
          <fieldset>
            <legend>🏠 Find an address</legend>
            <div className={styles.formRow}>
              <InputText
                name="postCode"
                onChange={onFieldChange}
                placeholder="Post Code"
                value={fields.postCode}
              />
            </div>
            <div className={styles.formRow}>
              <InputText
                name="houseNumber"
                onChange={onFieldChange}
                value={fields.houseNumber}
                placeholder="House number"
              />
            </div>
            <Button type="submit">Find</Button>
          </fieldset>
        </form>
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={onFieldChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {fields.selectedAddress && (
          <form onSubmit={handlePersonSubmit}>
            <fieldset>
              <legend>✏️ Add personal info to address</legend>
              <div className={styles.formRow}>
                <InputText
                  name="firstName"
                  placeholder="First name"
                  onChange={onFieldChange}
                  value={fields.firstName}
                />
              </div>
              <div className={styles.formRow}>
                <InputText
                  name="lastName"
                  placeholder="Last name"
                  onChange={onFieldChange}
                  value={fields.lastName}
                />
              </div>
              <Button type="submit">Add to addressbook</Button>
            </fieldset>
          </form>
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {/*error && <div className="error">{error}</div>*/}

        {/* Implemented Error Message using component - Jiban*/}
        {error && <ErrorMessage message={error || ""} />}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}
        {/* Implemented Reset button - Jiban*/}
        <Button type="button" variant="secondary" onClick={() => {
          resetFields();
          setAddresses([]);
          setError("");
        }}>
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
