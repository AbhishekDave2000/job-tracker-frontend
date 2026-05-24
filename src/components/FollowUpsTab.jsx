import { useState, useEffect }   from "react"
import { getFollowUps,
        createFollowUp,
        completeFollowUp,
        deleteFollowUp }         from "../api/followUps.api"
import toast                     from "react-hot-toast"

const followUpBadge = ({followUp}) => {
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

const followUpsTab = ({jobApplicationId}) => {
    const [followUps, setFollowUps] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [showForm, setShowForm]   = useState(false);

    return(
        <>
            Follow Up Tab will come here
        </>
    )
}