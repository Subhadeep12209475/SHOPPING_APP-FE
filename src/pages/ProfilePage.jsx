import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
import { Navbar } from "../components/navbar";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MdOutlineCloudUpload } from "react-icons/md";
import { SyncLoader } from "react-spinners";

const DUMMY_IMAGE =
    "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-profile-picture-business-profile-woman-suitable-social-media-profiles-icons-screensavers-as-templatex9_719432-1351.jpg?semt=ais_hybrid&w=740";

const ProfilePage = () => {
    const [userDetails, setUserDetails] = useState({});
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const inputFileRef = useRef(null);

    const getUserDetails = async () => {
        try {
            setLoadingProfile(true);
            const resp = await axiosInstance.get("/users/details");
            setUserDetails(resp.data.data.user);
        } catch (err) {
            ErrorToast(`${err.response?.data?.message || err.message}`);
        } finally {
            setTimeout(() => setLoadingProfile(false), 1000);
        }
    };

    const handleDPUpload = async (e) => {
        try {
            setIsImageUploading(true);
            const formData = new FormData();
            formData.append("displayPicture", e.target.files[0]);

            await axiosInstance.put("/users/display-picture", formData);
            SuccessToast("Image Uploaded!");
            getUserDetails();
        } catch (err) {
            ErrorToast(`Image upload failed: ${err.message}`);
        } finally {
            setIsImageUploading(false);
        }
    };

    const handleDisplayPictureContainerClick = () => {
        inputFileRef.current.click();
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 bg-blue-100 to-blue-100">
            <Navbar />
            {loadingProfile ? (
                <div className="py-10 flex items-center justify-center">
                    <SkeletonTheme baseColor="#ddd" highlightColor="#aaa">
                        <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md">
                            <Skeleton height={180} className="rounded-full mb-4 mx-auto" />
                            <Skeleton height={20} width={`80%`} className="mb-2 mx-auto" />
                            <Skeleton height={15} width={`60%`} className="mb-4 mx-auto" />
                            <Skeleton height={30} width={120} className="mx-auto" />
                        </div>
                    </SkeletonTheme>
                </div>
            ) : (
                <div className="flex justify-center py-10 px-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border-4 border-blue-200">

                        <div
                            className="relative mx-auto mb-6 flex justify-center items-center h-36 w-36 rounded-full border-4 border-indigo-400 overflow-hidden cursor-pointer hover:shadow-lg transition"
                            onClick={handleDisplayPictureContainerClick}
                        >
                            <img
                                src={userDetails.imageUrl || DUMMY_IMAGE}
                                alt="Profile"
                                className="object-cover h-full w-full"
                            />
                            {isImageUploading ? (
                                <SyncLoader className="absolute top-[40%] left-[35%]" size={10} color="#facc15" />
                            ) : (
                                <MdOutlineCloudUpload className="absolute top-[40%] left-[40%] h-9 w-9 text-pink-500" />
                            )}
                        </div>

                        <input
                            type="file"
                            onChange={handleDPUpload}
                            ref={inputFileRef}
                            className="hidden"
                        />

                        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    value={userDetails.email || ""}
                                    disabled
                                    className="w-full bg-gray-200 text-gray-700 rounded-lg p-3 border border-gray-300 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <p className="inline-block bg-blue-100 text-black px-3 py-1 rounded-lg text-sm">
                                    {userDetails.role || "N/A"}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    placeholder="Update your name"
                                    className="w-full bg-yellow-50 rounded-lg p-3 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select className="w-full bg-pink-50 rounded-lg p-3 border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                    <option value="">--- Select ---</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="bg-gradient-to-r from-purple-500 to-blue-400 hover:from-pink-600 hover:to-yellow-500 text-white font-bold rounded-xl py-3 mt-4 transition shadow-md"
                            >
                                Update Profile
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export { ProfilePage };
