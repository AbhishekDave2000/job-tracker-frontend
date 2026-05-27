import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getContacts, 
        createContact,
        deleteContact, 
        updateContact} from '../api/contacts.api'

const ContactsTab = ({jobApplicationId}) => {
    const navigate = useNavigate();
    const [contacts,    setContacts]    = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [showForm,    setShowForm]    = useState(false); 

    const [editingId, setEditingId]     = useState(null);
    const [editForm, setEditForm]       = useState({});

    const handleEditClick = (contact) => {
        setEditingId(contact.id);
        setEditForm({
            name:         contact.name,
            email:        contact.email,
            phone_number: contact.phone_number,
            note:         contact.note,
        })
    }

    const handleUpdate = async () => {
        try {
            await updateContact(editingId, editForm);
            
            setContacts((prev) => prev.map( (c) => c.id === editingId ? {...c, ...editForm} : c) )
            setEditingId(null);
            toast.success("Contact updated");
        } catch(err) {
            toast.error("Failed to update.")
        }
    }

    const [form, setForm] = useState({
        name:           "",
        email:          "",
        phone_number:   "",
        note:           "",
    });

    const [formLoading, setFormLoading] = useState(false);
    const [formError,   setFormError]   = useState("");
    
    useEffect( () => {
        const fetchContacts = async () => {
            try {
                const response = await getContacts(jobApplicationId);
                const raw      = response.data.data || []                
                setContacts(raw);
            } catch(err){
                toast.error("Failed to Load the Contacts")
            } finally {
                setLoading(false);
            }
        }

        fetchContacts()
    }, [jobApplicationId])

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleCreate = async () => {
        if(!form.name || !form.email) {
            setFormError("Name and Email are required.")
            return
        }

        try {
            setFormLoading(true)
            setFormError("")
            
            // Get the response from the backend
            const response = await createContact(jobApplicationId, form);
            const newContact = response.data.data
            setContacts((prev) => [...prev, newContact])

            //  reset the form
            setForm({ name: "", email: "", phone_number: "", note: "" })
            setShowForm(false)
            toast.success("Contact added!")
        } catch(err) {
            setFormError(err?.response?.data?.message || "Failed to add contact.")
        } finally {
            setFormLoading(false)
        }
    }

    const handleDelete = async (contactId) => {
        if (!window.confirm("Delete this contact?")) return

        try {
            await deleteContact(contactId)
            setContacts((prev) => prev.filter((c) => c.id !== contactId))
            toast.success("Contact deleted successfully.")
        } catch(err) {
            toast.error("Failed to delete contact")
        }
    }

    if (loading) return <p className="text-gray-400 text-sm">Loading contacts...</p>

    return(
        <div>

            <div className='flex items-center justify-between mb-4'>
                <h1 className='font-semibold text-gray-700'>
                    Contact ({contacts.length})
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className='text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition'
                >
                    {showForm ? "Cancel" : "+ Add Contact"}
                </button>
            </div>


            { showForm && 
                (
                    <div>
                        { formError && (
                            <p className='text-red-500 text-xs'>{formError}</p>
                        )}

                        <div className='flex gap-3'>
                            <div className='flex-1'>
                                <label className='block text-xs font-medium text-gray-600 mb-1'>
                                    Name <span className='text-red-500'>*</span>
                                </label>
                                <input 
                                    type="text"  
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder='Enter the name'
                                    className='w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus-ring-2 focus:ring-indigo-500'
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Enter the email"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className='block text-xs font-medium text-gray-600 mb-1'>
                                Phone Number
                            </label>
                            <input 
                                type="text" 
                                name="phone_number"
                                value={form.phone_number}
                                onChange={handleChange}
                                placeholder='Eg. (555)-555-5555'
                                className='w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Note
                            </label>
                            <textarea
                                name="note"
                                value={form.note}
                                onChange={handleChange}
                                rows={2}
                                placeholder="eg. Hiring manager, spoke at career fair..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            />
                        </div>

                        <button
                            onClick={handleCreate}
                            disabled={formLoading}
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
                        >
                            {formLoading ? "Saving..." : "Save Contact"}
                        </button>
                    </div>
                )}

                {contacts.length === 0 ? (
                    <p className='text-gray-400 text-sm text-center py-8'>
                        No contacts yet. Add one above. 
                    </p>
                ) : (
                    <div className='space-y-3'>
                        {contacts.map((contact) => (
                            <div key={contact.id} className="border border-gray-100 rounded-xl p-4">
                                { editingId === contact.id ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                                        />
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={editForm.phone_number}
                                            onChange={(e) => setEditForm((prev) => ({ ...prev, phone_number: e.target.value }))}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />

                                        <textarea
                                            value={editForm.note}
                                            onChange={(e) => setEditForm((prev) => ({ ...prev, note: e.target.value }))}
                                            placeholder="Note..."
                                            rows={2}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleUpdate}
                                                className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="text-xs border border-gray-300 px-3 py-1 rounded-lg"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm">{contact.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{contact.email}</p>
                                            {contact.phone_number && (
                                                <p className="text-xs text-gray-400 mt-0.5">{contact.phone_number}</p>
                                            )}
                                            {contact.note && (
                                                <p className="text-xs text-gray-400 mt-1 italic">{contact.note}</p>
                                            )}
                                        </div>
                                        <div className='flex item-center justify-evenly gap-2'>
                                            <button
                                                onClick={() => handleEditClick(contact)}
                                                className='text-sm font-semibold text-white bg-blue-400 hover:bg-blue-600 transition px-4 py-1 border rounded-lg'
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(contact.id)}
                                                className="text-sm font-semibold text-white bg-red-400 hover:bg-red-600 transition px-4 py-1 border rounded-lg"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ) }
                            </div>
                        ))}
                    </div>
                )}


        </div>
    )
}

export default ContactsTab;