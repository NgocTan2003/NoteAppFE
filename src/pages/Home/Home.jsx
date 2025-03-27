import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { NoteCard } from '../../components/Card/NoteCard'
import { MdAdd } from 'react-icons/md'
import { AddEditNote } from './AddEditNote'
import { useState } from 'react'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import moment from "moment"
import { Toast } from '../../components/ToastMessage/Toast'
import { EmptyCard } from '../../components/EmptyCard/EmptyCard'
import icon from '../../assets/images/icons8-list-is-empty.gif'

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({ isShown: false, type: "add", data: null })

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add"
  })

  const [isSearch, setIsSearch] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [allNotes, setAllNotes] = useState([]);

  // get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user")
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.clear();
        navigate('/login')
      }
    }
  }

  // get all note
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('get-all-notes');
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes)
      }
    } catch (err) {
      console.log("Có lỗi xảy ra, vui lòng thử lại.")
    }
  }

  // edit note
  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: noteDetails })
  }

  // delete note
  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId)
      if (response.data && !response.data.error) {
        showToastMessage("Note Delete Successfully", 'delete')
        getAllNotes();
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        console.log("Có lỗi xảy ra. Vui lòng thử lại")
      }
    }
  }

  // Search
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      console.log("response", response.data.notes);

      if (response.data && response.data.notes) {
        setIsSearch(true)
        console.log("all Note first ", allNotes);

        setAllNotes(response.data.notes)
        console.log("all Note last ", allNotes);
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  }

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    })
  }

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: ""
    })
  }

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    return (() => { })
  }, [])

  return (
    <div>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

      <h1 className='text-2xl text-center mt-10 text-green-500'>Home Page</h1>

      <div className='container mx-auto'>
        <div className='grid grid-cols-3 gap-4 mt-8'>
          {
            allNotes.length > 0 ? (
              allNotes.map((item, index) => (
                <NoteCard
                  key={item._id}
                  title={item.title}
                  date={moment(item.createOn).format('Do MMM YYYY')}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteNote(item)}
                  onPinNote={() => { }}
                />
              ))
            ) : (
              <EmptyCard srcImage={icon} message="Bạn chưa có Note nào. Hãy bấm nút thêm để bắt đầu tạo Note đầu tiên của bạn." />
            )
          }
        </div>
      </div>

      <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10'
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: 'add', data: null })
        }} >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)'
          }
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5"
      >
        <AddEditNote
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: 'add', data: null })
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  )
}

export default Home