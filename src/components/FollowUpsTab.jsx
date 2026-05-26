import { useState, useEffect }   from "react"
import { getFollowUps,
        createFollowUp,
        completeFollowUp,
        deleteFollowUp }         from "../api/followUps.api"
import toast                     from "react-hot-toast"

const FollowUpBadge = ({followUp}) => {
    const now = new Date();
    const remindAt = new Date(followUp.remind_at)

    if (followUp.completed) {
        return (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Completed
            </span>
        )
    }

    if (remindAt < now) {
        return (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                Overdue
            </span>
        )
    }

    return (
        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
            Pending
        </span>
    )
}

const FollowUpsTab = ({jobApplicationId}) => {
    const [followUps, setFollowUps] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [showForm, setShowForm]   = useState(false);


    const [form, setForm] = useState({
        message: "",
        remind_at: "",
    })

    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        const fetchFollowUps = async () => {
            try {
                const response = await getFollowUps(jobApplicationId)
                setFollowUps(response.data.data || [])
            } catch(err) {
                toast.error("Failed to load follow ups")
            } finally {
                setLoading(false);
            }
        }
        fetchFollowUps()

    }, [jobApplicationId])


    // For removing the follow up
    const handleDelete = async (id) => {
        if (!window.confirm("Remove this follow up?")) return
        try {
            await deleteFollowUp(id);
            setFollowUps((prev) => prev.filter((f) => f.id !== id))
            toast.success("Follow up removed successfully.")
        } catch (err) {
            toast.error("Can not remove the follow up")
        } 
    }

    // Form change
    const handleChange = (e) => {
        setForm ((prev) => ( {...prev, [e.target.name]: e.target.value } ))
    }

    // for creating follow up
    const handleCreate = async () => {
        if (!form.message || !form.remind_at) {
            setFormError("Message and Remind at can not be empty.")
            return
        }
        
        try {
            setFormLoading(true)
            setFormError("")

            const response = await createFollowUp(jobApplicationId ,form);
            const newFollowUp = response.data.data

            setFollowUps((prev) => [...prev, newFollowUp])
            setForm({ message: "", remind_at: "" })
            setShowForm(false)
            toast.success("Follow up generated successfully")
        } catch(err) {
            setFormError(err?.response?.data?.errors || "Can not generate the follow up")
        } finally {
            setFormLoading(false)
        }
    }

    // marking the follow up as complete
    const handleComplete = async (followUpId) => {
        try {
            await completeFollowUp(followUpId);
            setFollowUps((prev) => 
                prev.map((f) => 
                    f.id === followUpId
                    ? { ...f, completed: true, completed_at: new Date().toISOString() }
                    : f
                )
            )
            toast.success("Marked as complete!");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Can not complete the follow up")
        }
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-CA", {
            year:  "numeric",
            month: "short",
            day:   "numeric",
            hour:  "2-digit",
            minute: "2-digit",
        })
    }

    if(loading) return <p className="text-gray-400 text-sm">Loading Follow Ups...</p>

    return(
        <div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">
                    Follow Ups ({followUps.length})
                </h3>
                <button
                    onClick={ () => setShowForm(!showForm)} 
                    className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition">
                    {showForm ? "Cancel" : "+ Follow Up"}
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
                    This is Form

                    {formError && (
                        <p className="text-red-500 text-sm">{formError}</p>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Message <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="eg. Send thank you email"
                            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Remind At <span className="text-red-500 text-sm">*</span>
                        </label>

                        <input 
                            type="datetime-local" 
                            name="remind_at"
                            value={form.remind_at}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button 
                        onClick={handleCreate}
                        disabled={formLoading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                        {formLoading ? "Saving..." : "Save Follow Up"}
                    </button>
                </div>
            )}


            {followUps.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No Follow Ups Yet.</p>
            ) : (
                <div className="space-y-3">
                    {followUps.map((followUp) => (
                        <div 
                            key={followUp.id} 
                            className="flex items-start justify_between border border-gray-100 rounded-xl p-4"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <FollowUpBadge followUp={followUp}/>
                                </div>
                                <p className="text-sm text-gray-800 font-medium">{followUp.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatDate(followUp.remind_at)}</p>
                                {followUp.completed_at && (
                                    <p className="text-xs text-green-500 mt-0.5">
                                        Completed {formatDate(followUp.completed_at)}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col items-end gap-2 ml-4">
                                {!followUp.completed && (
                                    <button
                                        onClick={() => handleComplete(followUp.id)}
                                        className="text-xs text-green-500 hover:text-green-700 transition"
                                    >
                                        ✓ Complete
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete(followUp.id)}
                                    className="text-xs text-red-400 hover:text-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            )}
        </div>
    )
}

export default FollowUpsTab;