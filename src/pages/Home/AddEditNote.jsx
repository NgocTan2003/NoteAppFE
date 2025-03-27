import React, { useState } from 'react'
import { TagInput } from '../../components/Input/TagInput'
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

export const AddEditNote = ({ type, noteData, getAllNotes, onClose, showToastMessage }) => {
    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || []);

    const [error, setError] = useState(null)

    // Add Note
    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post("/add-note", {
                title,
                content,
                tags
            })
            if (response.data && response.data.note) {
                showToastMessage("Note Added Successfully")
                getAllNotes();
                onClose();
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message)
            }
        }
    }

    // Edit Note 
    const editNote = async () => {
        const noteId = noteData._id;
        try {
            const response = await axiosInstance.put("/edit-note/" + noteId, {
                title,
                content,
                tags
            })
            if (response.data && response.data.note) {
                showToastMessage("Note Update Successfully")
                getAllNotes();
                onClose();
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message)
            }
        } 
    }

    const handleAddNote = () => {
        if (title.trim() === "") {
            setError("Title is required")
            return
        }

        if (content.trim() === "") {
            setError("Content is required")
            return
        }

        setError("")
        type === "add" ? addNewNote() : editNote();
    }

    return (
        <div className='relative'>
            <div className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50'>
                <MdClose className='text-xl text-slate-400' onClick={onClose} />
            </div>

            <div className='flex flex-col gap-2'>
                <label className='input-label'>Title</label>
                <input
                    type='text'
                    className='text-2xl text-slate-950 outline-none'
                    placeholder='Đi tập thể dục'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>Content</label>
                <textarea
                    type='text'
                    className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                    rows={10}
                    placeholder='Content'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <div className='mt-3'>
                <label className='input-label'>TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

            <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>
                {type === "edit" ? "UPDATE" : "ADD"}
            </button>

        </div>
    )
}
