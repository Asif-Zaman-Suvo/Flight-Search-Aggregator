import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "@/components/ui/empty-state";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(
      <EmptyState
        title="No results"
        description="Try adjusting your filters"
      />
    );
    expect(screen.getByText("No results")).toBeInTheDocument();
    expect(screen.getByText("Try adjusting your filters")).toBeInTheDocument();
  });

  it("renders action button when provided", () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        title="No results"
        description="desc"
        action={{ label: "Reset filters", onClick }}
      />
    );
    const btn = screen.getByRole("button", { name: /reset filters/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not render action button when not provided", () => {
    render(<EmptyState title="No results" description="desc" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
