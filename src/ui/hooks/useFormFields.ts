//Implemented - Custom hook for Form Fields - Jiban
import React from "react";

type FormFields = {
    postCode: string;
    houseNumber: string;
    firstName: string;
    lastName: string;
    selectedAddress: string;
};

export default function useFormFields(initialValues: FormFields) {
    const [fields, setFields] = React.useState<FormFields>(initialValues);

    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFields(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetFields = () => setFields(initialValues);

    return { fields, onFieldChange, setFields, resetFields };
}
