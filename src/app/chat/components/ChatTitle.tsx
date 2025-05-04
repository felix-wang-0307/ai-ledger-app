"use client";

export default function ChatTitle(props: {
  title?: string;
  subTitle?: string;
  loading?: boolean;
  onCancel?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{props.title}</h1>
        {props.subTitle && <p className="text-gray-500">{props.subTitle}</p>}
      </div>
      {props.loading && (
        <button
          className="btn btn-primary"
          onClick={props.onCancel}
        >
          Cancel
        </button>
      )}
    </div>
  );
}