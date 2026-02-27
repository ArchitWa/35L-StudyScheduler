const ActionCard = ({ actionLabel, iconUrl, onAction }) => {
  return (
    <button type="button" className="flex h-[180px] w-[350px] cursor-pointer flex-col items-center justify-center gap-[10px] rounded-lg !border-[3px] !border-dashed !border-[#b0c4de] !bg-[#eaf0f6] p-[20px] text-center font-semibold text-[#5a7a9e]" onClick={onAction}>
      <div className="w-[56px] h-[56px] rounded-lg bg-white border-2 border-[#b0c4de] flex items-center justify-center">
        <img className="w-[32px] h-[32px]" src={iconUrl} alt={`${actionLabel} icon`} />
      </div>
      <div className="text-[1rem] font-bold text-[#2d6cb5]">{actionLabel}</div>
    </button>
  );
};

export default ActionCard;
