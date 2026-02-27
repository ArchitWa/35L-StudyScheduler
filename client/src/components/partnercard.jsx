// --- Partner Card Component ---
const PartnerCard = ({ firstName, lastInitial, profileImageUrl, onNameClick }) => {
  const displayName = `${firstName} ${lastInitial}.`;

  return (
    <div className="w-[350px] h-[280px] border-3 border-dashed border-[#b0c4de] bg-[#eaf0f6] flex flex-col justify-center items-center gap-3 text-[#5a7a9e] font-semibold rounded-lg text-center p-5">
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-solid border-[#b0c4de] bg-white">
        <img
          className="w-full h-full object-cover"
          src={profileImageUrl}
          alt={`${displayName} profile`}
        />
      </div>
      <button
        type="button"
        className="!bg-transparent border-none text-[#2d6cb5] text-[1.1rem] font-bold cursor-pointer px-2 py-1 hover:underline"
        onClick={onNameClick}
      >
        {displayName}
      </button>
      <div className="text-[0.85rem] text-[#6b86a6]">Potential study partner</div>
    </div>
  );
};

export default PartnerCard;
