import { Link } from "react-router-dom";
import { MessageSquare, ArrowLeft } from "lucide-react";

const MessagesPage = () => {
    return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
            <div className="bg-white rounded-[40px] border border-slate-100 p-12 shadow-2xl">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-10 h-10 text-indigo-500" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Messages Unavailable</h2>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                    The messaging service is currently undergoing maintenance to improve your experience. 
                    Please check back later or use other methods to contact recruiters.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/25"
                >
                    <ArrowLeft className="w-5 h-5" /> Go to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default MessagesPage;
