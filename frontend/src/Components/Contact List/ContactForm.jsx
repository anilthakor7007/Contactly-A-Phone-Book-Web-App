import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addContact, updateContact, selectCurrentContact } from '../../Features/ContactBook/contactsSlice';
import countryList from "../../../data.json";





const ContactForm = ({ contactId }) => {
    const dispatch = useDispatch();
    const contact = useSelector(state => selectCurrentContact(state, contactId));
    const [name, setName] = useState(contact ? contact.name : '');
    const [phone, setPhone] = useState(contact ? contact.phone : '');
    const [email, setEmail] = useState(contact ? contact.email : '');
    const [city, setCity] = useState(contact ? contact.city : '');
    const [country, setCountry] = useState(contact ? contact.country : '');
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isUpdating, setIsUpdating] = useState(!!contactId);
    const [errors, setErrors] = useState({});
    const dropdownRef = useRef(null);

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
        if (contactId && contact) {
            setIsUpdating(true);
            setName(contact.name);
            setPhone(contact.phone);
            setEmail(contact.email);
            setCity(contact.city);
            setCountry(contact.country);
        } else {
            setIsUpdating(false);
            setName('');
            setPhone('');
            setEmail('');
            setCity('');
            setCountry('');
        }
    }, [contact, contactId]);

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

        if (isUpdating) {
            dispatch(updateContact({
                id: contactId,
                name: trimmedName,
                phone: trimmedPhone,
                email: trimmedEmail,
                city: trimmedCity,
                country: trimmedCountry
            }));
        } else {
            dispatch(addContact({
                name: trimmedName,
                phone: trimmedPhone,
                email: trimmedEmail,
                city: trimmedCity,
                country: trimmedCountry
            }));
            setName('');
            setPhone('');
            setEmail('');
            setCity('');
            setCountry('');
        }
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
        <form onSubmit={handleSubmit} className="p-4 bg-white bg-opacity-25 rounded shadow-md">
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => handleChange(e, validateName)}
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.name ? 'border-red-500' : ''}`}
                    // required
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
                    // required
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
                    // required
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
                    // required
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
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={handleKeyDown}
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.country ? 'border-red-500' : ''}`}
                    // required
                />
                {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                {showDropdown && filteredCountries.length > 0 && (
                    <ul ref={dropdownRef} className="absolute mt-1 w-full border border-gray-300 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
                        {filteredCountries.map((item, index) => (
                            <li
                                key={item}
                                onClick={() => handleCountrySelect(item)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${highlightedIndex === index ? 'bg-gray-200' : ''}`}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border  text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                {isUpdating ? 'Update Contact' : 'Add Contact'}
            </button>
        </form>
    );
};

export default ContactForm;
