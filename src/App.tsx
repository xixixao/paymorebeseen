import { FormEvent, useEffect, useRef, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export default function App() {
  const paymentId = useConsumeQueryParam("paymentId");

  const sentMessageId = useQuery(api.payments.getMessageId, {
    paymentId: (paymentId ?? undefined) as Id<"payments"> | undefined,
  });
  const messages = useQuery(api.messages.list) || [];

  const [newMessageText, setNewMessageText] = useState("");
  const [amount, setAmount] = useState("1.00");
  const payAndSendMessage = useAction(api.stripe.pay);

  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    listRef.current!.scrollTop = 0;
  }, [messages]);

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();
    const paymentUrl = await payAndSendMessage({
      text: newMessageText,
      amount,
    });
    window.location.href = paymentUrl!;
  }
  return (
    <main>
      <h1>Pay More, Be Seen</h1>
      <form onSubmit={handleSendMessage}>
        <div className="amountInput">
          $
          <input
            type="number"
            step="0.10"
            placeholder="0.00"
            min="1.00"
            max="999999999.99"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            onBlur={() => {
              setAmount(parseFloat(amount).toFixed(2));
            }}
          />
        </div>
        <input
          maxLength={100}
          value={newMessageText}
          onChange={(event) => setNewMessageText(event.target.value)}
          placeholder="Write a message…"
        />
        <input
          type="submit"
          value={`Pay and be seen!`}
          disabled={!newMessageText}
        />
      </form>
      <ul ref={listRef}>
        {messages.map((message) => (
          <li
            key={message._id}
            className={sentMessageId === message._id ? "sent" : ""}
          >
            <span>${(message.amount / 100).toFixed(2)}</span>
            <span>{message.text}</span>
            <span>
              {new Date(message._creationTime).toLocaleDateString()}{" "}
              {new Date(message._creationTime).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
      <div>
        Built on{" "}
        <a href="https://convex.dev/" target="_blank">
          Convex
        </a>
        {", "}
        source on{" "}
        <a href="https://github.com/xixixao/paymorebeseen" target="_blank">
          Github
        </a>
      </div>
    </main>
  );
}

function useConsumeQueryParam(name: string) {
  const [value] = useState(
    new URLSearchParams(window.location.search).get(name)
  );

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;
    searchParams.delete(name);
    const consumedUrl =
      currentUrl.origin + currentUrl.pathname + searchParams.toString();
    window.history.replaceState(null, "", consumedUrl);
  }, []);
  return value;
}
