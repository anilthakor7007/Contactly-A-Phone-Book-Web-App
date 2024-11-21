import React from 'react';
import PropTypes from 'prop-types';

const ContactItem = ({ contact, onDelete, onEdit }) => {
    return (
        <li className="mb-4 p-4 bg-gray-100 rounded shadow-md">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold">{contact.name}</h3>
                    <p className="text-sm text-gray-600">No: {contact.phone}</p>
                    <p className="text-sm text-gray-600">Email: {contact.email}</p>
                    <p className="text-sm text-gray-600">City: {contact.city}</p>
                    <p className="text-sm text-gray-600">Country: {contact.country}</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(contact)} // Call onEdit with the current contact
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        aria-label={`Edit contact ${contact.name}`}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(contact._id, contact.name)} // Call onDelete with the current contact
                        className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                        aria-label={`Delete contact ${contact.name}`}
                    >
                       Delete
                    </button>
                </div>
            </div>
        </li>
    );
};

ContactItem.propTypes = {
    contact: PropTypes.shape({
        _id: PropTypes.string.isRequired, 
        name: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        city: PropTypes.string,
        country: PropTypes.string,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired, // Add propType for onEdit
};

export default ContactItem;
