import { useRef, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { FaUser, FaEdit } from "react-icons/fa";
import { MdDone } from "react-icons/md";
import toast from "react-hot-toast"
import axiosInstance from '../../api/axiosInstance';

function Profile() {
    const { authUser, setAuthUser } = useAuthContext();
    const [newName, setNewName] = useState(authUser.fullname);
    const [isEditing, setIsEditing] = useState(false);
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef(null)

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleProfilepIc = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please upload a file to update")
            return
        }

        const formData = new FormData()
        formData.append("profilePic", file)
        setLoading(true)
        try {
            const res = await axiosInstance.post("/auth/edit/pic", formData)
            const data = res.data;

            if (data) {
                toast.success("Profile Pic has been uploaded successfully")
                const updatedUser = { ...authUser, profilePic: data.profilePic };
                setAuthUser(updatedUser);
                localStorage.setItem('chat-user', JSON.stringify(updatedUser));
            } else {
                throw new error
            }
        } catch (error) {
            console.log("Error while updating profile pic", error);
        } finally {
            setLoading(false)
            setFile(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/auth/edit/name", { fullname: newName });

            const data = res.data;

            if (data) {
                const updatedUser = { ...authUser, fullname: newName };
                setAuthUser(updatedUser);
                localStorage.setItem('chat-user', JSON.stringify(updatedUser));
            }

        } catch (error) {
            console.error("Error while updating the name", error);
        } finally {
            setIsEditing(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <div className="w-40 h-40 md:w-56 md:h-56 mb-4 md:mb-0">
                    <img
                        src={authUser.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full ring-2 ring-primary ring-offset-2"
                    />
                </div>
                <form className='flex flex-col items-center justify-center' onSubmit={handleProfilepIc}>
                    <input
                        type="file"
                        className="file-input file-input-ghost w-full max-w-xs"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary mt-2"
                        disabled={loading} >
                        {!loading ? "Upload Profile Picture" : <span className='loading loading-spinner'></span>}
                    </button>
                </form>
            </div>
            <div className='flex flex-col sm:flex-row items-center text-xl sm:text-2xl border border-slate-300 rounded-xl shadow-md p-4'>
                <FaUser className="mb-2 sm:mb-0 sm:mr-4" />
                {isEditing ? (
                    <form className='flex-grow flex flex-col justify-between sm:flex-row items-center' onSubmit={handleSubmit}>
                        <input
                            type='text'
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            className="input input-bordered w-full sm:w-auto mb-2 sm:mb-0 sm:mr-4"
                        />
                        <button
                            type="submit"
                            className='text-green-500 hover:text-green-700'
                        >
                            <MdDone size={24} />
                        </button>
                    </form>
                ) : (
                    <>
                        <span className='flex-grow mb-2 sm:mb-0'>{authUser.fullname}</span>
                        <button
                            className='text-blue-500 hover:text-blue-700'
                            onClick={() => setIsEditing(true)}
                        >
                            <FaEdit size={24} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Profile;