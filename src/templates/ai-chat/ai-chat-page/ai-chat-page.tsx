import { MenuIcon, PlusIcon, Trash2Icon, CopyIcon, RefreshCwIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import {
  ChatMessages,
  ChatPrompt,
  ChatSuggestions,
  messageText,
  type ChatAction,
  type ChatMessageData,
  type ChatMessagesProps,
  type ChatPromptProps,
  type ChatStatus,
  type ChatSuggestion,
} from "../../../components/ai-chat";
import { Modal } from "../../../components/elements/modal";
import { Button } from "../../../components/ui/button";

export type AiChatConversation = {
  id: string;
  title?: string;
  /** A heading to group the list under, e.g. "Today" or "Last week". Equal neighbours share one heading. */
  group?: string;
};

export type AiChatPageProps = {
  conversations?: AiChatConversation[];
  /** The open conversation. `null` or nothing is a new chat. */
  activeConversationId?: string | null;
  onSelectConversation?: (id: string) => void;
  onNewConversation?: () => void;
  /** Adds a delete button to each conversation. */
  onDeleteConversation?: (id: string) => void;
  messages?: ChatMessageData[];
  status?: ChatStatus;
  /** Sends what the user wrote, with the files. */
  onSend: (text: string, files: File[]) => void;
  onStop?: () => void;
  /** Generates the last answer again; also the button of the prompt after an error. */
  onReload?: () => void;
  /** The title above the chat. Defaults to the title of the open conversation. */
  title?: ReactNode;
  /** Beside the title, at the end: a share button, a model picker. */
  headerActions?: ReactNode;
  /** The heading of the empty chat. */
  welcomeTitle?: ReactNode;
  welcomeDescription?: ReactNode;
  /** Prompts shown in the empty chat. */
  suggestions?: (string | ChatSuggestion)[];
  /** Draws the text of the answers, e.g. with Markdown. */
  renderText?: ChatMessagesProps["renderText"];
  renderPart?: ChatMessagesProps["renderPart"];
  /** Replaces the buttons under each answer (copy and regenerate). */
  getActions?: ChatMessagesProps["getActions"];
  /** Small print under the prompt, e.g. "The assistant can make mistakes." */
  note?: ReactNode;
  placeholder?: string;
  /** Lets the user attach files. */
  attachments?: boolean;
  accept?: ChatPromptProps["accept"];
  /** Hides the list of conversations. */
  sidebar?: boolean;
  className?: string;
};

/**
 * A chat screen: the list of conversations at the side (a drawer on a phone), and the
 * conversation with its prompt. With no messages it welcomes the user and offers suggestions.
 * It fills its parent, so give the parent a height. The app owns the data: the conversations, the
 * messages and the status come in as props and the handlers say what the user did.
 */
export function AiChatPage({
  conversations = [],
  activeConversationId = null,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  messages = [],
  status = "ready",
  onSend,
  onStop,
  onReload,
  title,
  headerActions,
  welcomeTitle,
  welcomeDescription,
  suggestions = [],
  renderText,
  renderPart,
  getActions,
  note,
  placeholder,
  attachments = false,
  accept,
  sidebar = true,
  className,
}: AiChatPageProps) {
  const { t } = useLostTranslation();
  const [historyOpen, setHistoryOpen] = useState(false);
  const active = conversations.find((conversation) => conversation.id === activeConversationId);

  const history = (
    <ConversationList
      conversations={conversations}
      activeId={activeConversationId}
      onSelect={(id) => {
        setHistoryOpen(false);
        onSelectConversation?.(id);
      }}
      onNew={
        onNewConversation &&
        (() => {
          setHistoryOpen(false);
          onNewConversation();
        })
      }
      onDelete={onDeleteConversation}
    />
  );

  const defaultActions = (message: ChatMessageData, isLast: boolean): ChatAction[] | undefined => {
    if (message.role !== "assistant") return undefined;
    const actions: ChatAction[] = [
      {
        label: t("aiChat.copy"),
        icon: <CopyIcon />,
        onClick: () => void navigator.clipboard?.writeText(messageText(message)),
      },
    ];
    if (isLast && onReload) {
      actions.push({ label: t("aiChat.regenerate"), icon: <RefreshCwIcon />, onClick: onReload });
    }
    return actions;
  };

  const heading = title ?? active?.title;

  return (
    <div data-slot="ai-chat-page" className={cn("flex h-full min-h-0 bg-background", className)}>
      {sidebar && (
        <aside
          aria-label={t("aiChatPage.history")}
          className="hidden w-72 shrink-0 flex-col border-r bg-muted/30 md:flex"
        >
          {history}
        </aside>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
          {sidebar && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={t("aiChatPage.openHistory")}
              onClick={() => setHistoryOpen(true)}
            >
              <MenuIcon aria-hidden="true" />
            </Button>
          )}
          <h1 className="min-w-0 flex-1 truncate text-sm font-medium">{heading}</h1>
          {headerActions}
        </header>
        <ChatMessages
          messages={messages}
          status={status}
          renderText={renderText}
          renderPart={renderPart}
          getActions={getActions ?? defaultActions}
          empty={
            <div className="grid justify-items-center gap-6 text-center">
              <div className="grid gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-balance">
                  {welcomeTitle ?? t("aiChatPage.welcomeTitle")}
                </h2>
                {welcomeDescription && (
                  <p className="text-sm text-balance text-muted-foreground">{welcomeDescription}</p>
                )}
              </div>
              {suggestions.length > 0 && (
                <ChatSuggestions
                  layout="grid"
                  className="w-full max-w-xl text-left"
                  suggestions={suggestions}
                  onSelect={(text) => onSend(text, [])}
                  disabled={status === "submitted" || status === "streaming"}
                />
              )}
            </div>
          }
          footer={
            <div className="grid gap-2">
              <ChatPrompt
                status={status}
                onSubmit={onSend}
                onStop={onStop}
                onReload={onReload}
                placeholder={placeholder}
                attachments={attachments}
                accept={accept}
                autoFocus
              />
              {note && <p className="text-center text-xs text-muted-foreground">{note}</p>}
            </div>
          }
        />
      </div>
      {sidebar && (
        <Modal
          side="left"
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          title={t("aiChatPage.history")}
        >
          <div className="flex h-[calc(100dvh-8rem)] flex-col">{history}</div>
        </Modal>
      )}
    </div>
  );
}

type ConversationListProps = {
  conversations: AiChatConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: (() => void) | undefined;
  onDelete: ((id: string) => void) | undefined;
};

function ConversationList({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: ConversationListProps) {
  const { t } = useLostTranslation();
  const groups = conversations.reduce<{ label: string | undefined; items: AiChatConversation[] }[]>(
    (all, conversation) => {
      const last = all.at(-1);
      if (last && last.label === conversation.group) last.items.push(conversation);
      else all.push({ label: conversation.group, items: [conversation] });
      return all;
    },
    [],
  );

  return (
    <>
      {onNew && (
        <div className="p-3">
          <Button type="button" variant="outline" className="w-full justify-start" onClick={onNew}>
            <PlusIcon aria-hidden="true" />
            {t("aiChatPage.newChat")}
          </Button>
        </div>
      )}
      <nav
        aria-label={t("aiChatPage.history")}
        className="min-h-0 flex-1 overflow-y-auto px-2 pb-3"
      >
        {conversations.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            {t("aiChatPage.noConversations")}
          </p>
        ) : (
          groups.map((group, index) => (
            <div key={`${group.label ?? ""}-${index}`} className="mb-3">
              {group.label && (
                <h3 className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  {group.label}
                </h3>
              )}
              <ul className="grid gap-0.5">
                {group.items.map((conversation) => {
                  const label = conversation.title ?? t("aiChatPage.untitled");
                  const current = conversation.id === activeId;
                  return (
                    <li key={conversation.id} className="group/conversation relative">
                      <button
                        type="button"
                        aria-current={current ? "true" : undefined}
                        onClick={() => onSelect(conversation.id)}
                        className={cn(
                          "block w-full truncate rounded-md px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50",
                          onDelete && "pr-9",
                          current && "bg-accent font-medium",
                        )}
                      >
                        {label}
                      </button>
                      {onDelete && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={t("aiChatPage.deleteConversation", { title: label })}
                          onClick={() => onDelete(conversation.id)}
                          className="absolute right-1 top-1/2 size-7 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity focus-visible:opacity-100 group-hover/conversation:opacity-100 pointer-coarse:opacity-100 [&_svg]:size-3.5"
                        >
                          <Trash2Icon aria-hidden="true" />
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </nav>
    </>
  );
}
