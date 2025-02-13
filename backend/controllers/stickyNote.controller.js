const StickyNote = require("../models/stickyNote.model");

// 📌 **Add a new sticky note**
exports.addStickyNote = async (req, res) => {
    try {
        const { type, message, url } = req.body;

        if ( !type || !message) {
            return res.status(400).json({ message: "type, and message are required" });
        }

        const newNote = new StickyNote({ user: req.user._id , type, message, url });
        await newNote.save();

        return res.status(201).json({
            message: "Sticky note added successfully",
            note: newNote,
        });
    } catch (error) {
        console.error("Error adding sticky note:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// 📌 **Delete a sticky note**
exports.deleteStickyNote = async (req, res) => {
    try {
        const { noteId } = req.params;

        if (!noteId) {
            return res.status(400).json({ message: "Note ID is required" });
        }

        const deletedNote = await StickyNote.findOneAndDelete({_id: noteId, user: req.user._id});

        if (!deletedNote) {
            return res.status(404).json({ message: "Sticky note not found" });
        }

        return res.status(200).json({ message: "Sticky note deleted successfully" });
    } catch (error) {
        console.error("Error deleting sticky note:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
