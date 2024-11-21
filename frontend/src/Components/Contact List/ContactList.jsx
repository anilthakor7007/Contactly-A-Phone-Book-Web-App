import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteContact, fetchContacts, selectAllContacts } from '../../Features/ContactBook/contactsSlice';
import { logout } from '../../Auth/authSlice';
import ContactItem from './ContactItem';
import ContactForm from './ContactForm';
import EditForm from './EditForm'; // Import EditForm component
import ConfirmLogout from '../../Components/ConfirmLogout';
import { toast } from 'react-toastify';

import ConfirmDelete from '../ConfirmDelete';

const ContactList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const contacts = useSelector(selectAllContacts);
    const status = useSelector((state) => state.contacts.status);
    const error = useSelector((state) => state.contacts.error);
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const [editingContact, setEditingContact] = useState(null); // State to manage editing



    useEffect(() => {
        dispatch(fetchContacts());
    }, [dispatch]);


    const handleDelete = (id, name) => {
        if(id){
        toast(
            ({ closeToast }) => (
              <ConfirmDelete
                onConfirm={() => {
                    dispatch(deleteContact(id)) // Replace with your delete action
                  toast.dismiss(); // Close the toast after confirming
                }}
                onCancel={() => toast.dismiss()} // Ensure this dismisses the toast
              />
            ),
            {
              position: "top-center",
              autoClose: false, // Keep the toast open until the user interacts
              closeOnClick: false,
              draggable: false,
              hideProgressBar: true,
            }
          );
        }else{
            console.error('Contact id is undefined');
        }

        // if (window.confirm(`Are you sure you want to delete ${name}?`)) {
        //     if (id) {
        //         dispatch(deleteContact(id));
        //     } else {
        //         console.error('Contact id is undefined');
        //     }
        // }
    };

    const handleEditClick = (contact) => {
        setEditingContact(contact); // Set the contact to be edited
    };

    const handleCancelEdit = () => {
        setEditingContact(null); // Clear editing mode
    };

    const handleLogout = () => {
        toast(
          ({ closeToast }) => (
            <ConfirmLogout
              onConfirm={() => {
                dispatch(logout());
                localStorage.removeItem('token');
                navigate('/');
                toast.dismiss(); // Close the toast after confirming
              }}
              onCancel={() => toast.dismiss()}
            />
          ),
          {
            position: "top-right",
            autoClose: false, // Keep the toast open until the user interacts
            closeOnClick: false,
            draggable: false,
            hideProgressBar: true,
          }
        );
      };
    // const handleLogout = () => {
    //     dispatch(logout());
    //     localStorage.removeItem('token');
    //     navigate('/');
    // };

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>Error: {error}</div>;

    return (
        <div className="p-4 ">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4 ">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xl text-gray-600">👤</span>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">{user?.username || 'Guest'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
            <div className="flex gap-8">
                <div className="flex-1 min-w-[300px] overflow-y-auto h-[535px]">
                    <ul>
                        {Array.isArray(contacts) && contacts.length > 0 ? (
                            contacts.map(contact => (
                                <ContactItem
                                    key={contact._id}
                                    contact={contact}
                                    onDelete={handleDelete}
                                    onEdit={() => handleEditClick(contact)} // Pass edit handler
                                />
                            ))
                        ) : (
                            <p>No contacts found.</p>
                        )}
                    </ul>
                </div>
                <div className="flex-1 min-w-[300px]">
                    <div className="bg-white bg-opacity-50 p-4 rounded shadow-md ">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingContact ? 'Edit Contact' : 'Add New Contact'}
                        </h2>
                        {editingContact ? (
                            <EditForm contact={editingContact} onCancel={handleCancelEdit} />
                        ) : (
                            <ContactForm />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactList;
