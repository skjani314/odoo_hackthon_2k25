import React, { useState, useContext } from 'react';
import Modal from '../ui/Modal/Modal.jsx';
import TextAreaField from '../ui/TextArea/TextArea.jsx';
import Button from '../ui/button/Button.jsx';
import LoadingSpinner from '../ui/Loading/Loading.jsx';
import ErrorMessage from '../ui/Error/Error.jsx';    







const SwapRequestModal = ({ isOpen, onClose, onSubmit, recipientUser }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const result = await onSubmit(message);
    if (!result || !result.success) {
      setError(result?.error || 'Failed to send request.');
    }
    setIsLoading(false);
    if (result?.success) {
      setMessage('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Send Swap Request to ${recipientUser?.name}`}>
      <form onSubmit={handleSubmit}>
        <ErrorMessage message={error} />
        <p className="text-gray-700 mb-4">
          You are requesting a skill swap with <span className="font-semibold">{recipientUser?.name}</span>.
          Consider mentioning which of your skills you'd like to offer and which of their skills you're interested in.
        </p>
        <TextAreaField
          label="Your Message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hi, I'm interested in your [skill] and can offer [my skill]. Let me know!"
          rows={5}
          required
        />
        <div className="flex justify-end space-x-4 mt-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : 'Send Request'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SwapRequestModal;  