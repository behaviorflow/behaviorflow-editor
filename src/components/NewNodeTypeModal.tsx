import Modal from "./Modal";

const NewNodeTypeModal = ({ isOpen, onClose }) => {
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="New Node Type"
      >
        <div>
          Hello
        </div>
      </Modal>
		</div>
  );
};

export default NewNodeTypeModal;