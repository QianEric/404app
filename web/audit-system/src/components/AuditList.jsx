import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AuditList.module.css';

function AuditList({ user }) {
  const [diaries, setDiaries] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchDiaries();
  }, [statusFilter]);

  const fetchDiaries = async () => {
    try {
      const username = localStorage.getItem('username');
      const response = await axios.get(`/api/diaries?status=${statusFilter}&username=${username}`);
      setDiaries(response.data);
    } catch (error) {
      console.error('获取游记失败:', error);
    }
  };

  const handleAction = async (id, action, reason = null) => {
    try {
      const username = localStorage.getItem('username');
      await axios.put(`/api/diaries/${id}`, {
        status: action,
        rejectReason: reason,
        username,
      });
      fetchDiaries();
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  return (
    <div className={styles.auditList}>
      <h2>审核列表</h2>
      <div className={styles.filter}>
        <label>按状态筛选:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">全部</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">未通过</option>
        </select>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>标题</th>
            <th>内容</th>
            <th>图片</th>
            <th>状态</th>
            <th>拒绝原因</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {diaries.map(diary => (
            <tr key={diary._id}>
              <td>{diary.title}</td>
              <td>{diary.content}</td>
              <td>
                {diary.images?.map((img, index) => (
                  <img key={index} src={img} alt="Diary" className={styles.image} />
                ))}
              </td>
              <td>{diary.status === 'pending' ? '待审核' : diary.status === 'approved' ? '已通过' : '未通过'}</td>
              <td>{diary.rejectReason || '-'}</td>
              <td>
                {diary.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(diary._id, 'approved')}
                      className={styles.approveBtn}
                    >
                      通过
                    </button>
                    <div>
                      <input
                        type="text"
                        placeholder="拒绝原因"
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                      <button
                        onClick={() => handleAction(diary._id, 'rejected', rejectReason)}
                        className={styles.rejectBtn}
                      >
                        拒绝
                      </button>
                    </div>
                  </>
                )}
                {user.role === 'admin' && !diary.isDeleted && (
                  <button
                    onClick={() => handleAction(diary._id, 'deleted')}
                    className={styles.deleteBtn}
                  >
                    删除
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AuditList;
