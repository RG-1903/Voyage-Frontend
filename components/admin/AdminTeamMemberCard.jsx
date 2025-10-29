import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import { getAssetUrl } from '../../utils/helpers'; // Ensure path is correct

const AdminTeamMemberCard = ({ member, onEdit, onDelete }) => (
    <motion.div layout className="bg-white rounded-lg shadow-md flex items-center p-4 gap-4">
        <img
            src={getAssetUrl(member.image)}
            alt={member.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://i.pravatar.cc/150'; }}
        />
        <div className="flex-grow">
            <h3 className="font-bold text-lg text-slate-800">{member.name}</h3>
            <p className="text-sm text-slate-500">{member.title}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={() => onEdit(member)} className="flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded-md transition-colors"><Edit size={16} className="mr-1"/> Edit</button>
            <button onClick={() => onDelete(member._id)} className="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md transition-colors"><Trash2 size={16} className="mr-1"/> Delete</button>
        </div>
    </motion.div>
);

export default AdminTeamMemberCard;