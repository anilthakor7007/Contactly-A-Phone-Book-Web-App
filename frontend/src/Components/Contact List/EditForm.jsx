import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateContact } from '../../Features/ContactBook/contactsSlice';
import countryList from "../../../data.json";

const EditForm = ({ contact, onCancel }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState(contact.name);
    const [phone, setPhone] = useState(contact.phone);
    const [email, setEmail] = useState(contact.email);
    const [city, setCity] = useState(contact.city);
    const [country, setCountry] = useState(contact.country);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [errors, setErrors] = useState({});
    const dropdownRef = useRef(null);

    useEffect(() => {
        setName(contact.name);
        setPhone(contact.phone);
        setEmail(contact.email);
        setCity(contact.city);
        setCountry(contact.country);
    }, [contact]);

    useEffect(() => {
        if (country) {
            const filtered = countryList.filter(c => c.toLowerCase().includes(country.toLowerCase()));
            setFilteredCountries(filtered);
            setShowDropdown(filtered.length > 0);
        } else {
            setFilteredCountries([]);
            setShowDropdown(false);
        }
    }, [country]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const validateName = (value) => {
        if (!value.trim()) return 'Name is required';
        const validName = value.trim().replace(/\s+/g, ' ');
        if (validName.split(' ').length > 3) return 'Name should not exceed 3 words';
        return '';
    };

    const validatePhone = (value) => {
        if (!value.trim()) return 'Phone is required';
        const validPhone = value.trim().replace(/\s+/g, '');
        if (!/^\d{10,15}$/.test(validPhone)) return 'Phone should be 10-15 digits';
        return '';
    };

    const validateEmail = (value) => {
        if (!value.trim()) return 'Email is required';
        const validEmail = value.trim().replace(/\s+/g, '');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validEmail)) return 'Invalid email format';
        return '';
    };

    const validateCity = (value) => {
        if (!value.trim()) return 'City is required';
        return '';
    };

    const validateCountry = (value) => {
        if (!value.trim()) return 'Country is required';
        return '';
    };

    const handleChange = (e, validator) => {
        const { id, value } = e.target;
        const error = validator(value);
        setErrors(prevErrors => ({
            ...prevErrors,
            [id]: error
        }));

        switch (id) {
            case 'name':
                setName(value);
                break;
            case 'phone':
                setPhone(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'city':
                setCity(value);
                break;
            case 'country':
                setCountry(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const nameError = validateName(name);
        const phoneError = validatePhone(phone);
        const emailError = validateEmail(email);
        const cityError = validateCity(city);
        const countryError = validateCountry(country);

        if (nameError || phoneError || emailError || cityError || countryError) {
            setErrors({
                name: nameError,
                phone: phoneError,
                email: emailError,
                city: cityError,
                country: countryError
            });
            return;
        }

        const trimmedName = name.trim().replace(/\s+/g, ' ');
        const trimmedPhone = phone.trim().replace(/\s+/g, '');
        const trimmedEmail = email.trim().replace(/\s+/g, '');
        const trimmedCity = city.trim().replace(/\s+/g, ' ');
        const trimmedCountry = country.trim().replace(/\s+/g, ' ');

        dispatch(updateContact({
            id: contact._id,
            contact: { name: trimmedName, phone: trimmedPhone, email: trimmedEmail, city: trimmedCity, country: trimmedCountry }
        })).unwrap().then(() => {
            // Success callback, clear the form or give user feedback
            onCancel();
        }).catch((error) => {
            // Error callback, show error message or log the error
            console.error('Failed to update contact:', error);
        });
    };

    const handleCountrySelect = (selectedCountry) => {
        setCountry(selectedCountry);
        setFilteredCountries([]);
        setShowDropdown(false);
    };

    const handleKeyDown = (e) => {
        if (showDropdown) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex(prevIndex => Math.min(prevIndex + 1, filteredCountries.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex(prevIndex => Math.max(prevIndex - 1, 0));
            } else if (e.key === 'Enter' && highlightedIndex >= 0) {
                e.preventDefault();
                handleCountrySelect(filteredCountries[highlightedIndex]);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-opacity-25 rounded shadow-md">
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => handleChange(e, validateName)}
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone:</label>
                <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => handleChange(e, validatePhone)}
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => handleChange(e, validateEmail)}
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City:</label>
                <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => handleChange(e, validateCity)}
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.city ? 'border-red-500' : ''}`}
                />
                {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>
            <div className="mb-4 relative">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country:</label>
                <input
                    type="text"
                    id="country"
                    value={country}
                    onChange={(e) => handleChange(e, validateCountry)}
                    onClick={() => setShowDropdown(true)}
                    onKeyDown={handleKeyDown}
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.country ? 'border-red-500' : ''}`}
                />
                {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                {showDropdown && (
                    <div ref={dropdownRef} className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                        {filteredCountries.map((c, index) => (
                            <div
                                key={c}
                                className={`p-2 cursor-pointer ${index === highlightedIndex ? 'bg-gray-100' : ''}`}
                                onMouseDown={() => handleCountrySelect(c)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                {c}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button
                type="submit"
                className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600"
            >
                Update Contact
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-gray-400 via-gray-400 to-gray-400 text-white font-semibold rounded-md shadow-sm hover:bg-gray-600"
            >
                Cancel
            </button>
        </form>
    );
};

export default EditForm;
