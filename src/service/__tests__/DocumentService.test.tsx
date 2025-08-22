import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { documentAPI } from "../DocumentService";
import { createWrapper } from "../../utils/test-utils";

const handlers = [
  http.post(
    "https://putsreq.com/84j22N5I1l62gT5f4j22/upload",
    () => {
      return HttpResponse.json({ success: true });
    }
  ),
  http.get(
    "https://putsreq.com/84j22N5I1l62gT5f4j22/search",
    () => {
      return HttpResponse.json({
        data: {
          documents: {
            content: [],
            pageable: {
              pageNumber: 0,
              pageSize: 4,
            },
            totalPages: 1,
            totalElements: 0,
          },
        },
      });
    }
  ),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("documentAPI", () => {
  it("should refetch documents after upload", async () => {
    const { result } = renderHook(
      () => ({
        upload: documentAPI.useUploadDocumentsMutation(),
        documents: documentAPI.useFetchDocumentsQuery({
          page: 0,
          size: 4,
          name: "",
        }),
      }),
      {
        wrapper: createWrapper(),
      }
    );

    const [upload] = result.current.upload;
    const formData = new FormData();
    formData.append("file", new Blob(["test"]), "test.txt");

    const uploadPromise = upload(formData);

    await waitFor(() => {
      expect(result.current.documents.isFetching).toBe(true);
    });

    await uploadPromise;

    await waitFor(() => {
      expect(result.current.documents.isFetching).toBe(false);
    });
  });
});