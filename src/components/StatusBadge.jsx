const STATUS_STYLES = {
    bookmarked: "bg-blue-100 text-blue-700",
    applied: "bg-yellow-100 text-yellow-700",
    interview: "bg-purple-100 text-purple-700",
    offer: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    withdrawn: "bg-gray-100 text-gray-700",
}

const StatusBadge = ({status}) => {
    const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-600";

    return(
        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${style}`}>
            {status}
        </span>
    );
};

export default StatusBadge;