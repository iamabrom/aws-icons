import {
  Box,
  Button,
  Container,
  CssBaseline,
  GridLegacy,
  IconButton,
  InputAdornment,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { Brightness4, Brightness7, Search, Clear } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";

const rawIcons = import.meta.glob("./assets/icons/services/**/*.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const iconsByFolder: Record<string, { filename: string; displayName: string; url: string }[]> = {};

Object.entries(rawIcons).forEach(([path, url]) => {
  const parts = path.split("/");
  const folder = parts[parts.length - 2];
  const filename = parts[parts.length - 1];
  const displayName = filename.replace(".png", "").replace(/-/g, " ");
  if (!iconsByFolder[folder]) iconsByFolder[folder] = [];
  iconsByFolder[folder].push({ filename, displayName, url });
});

const sortedIcons = Object.entries(iconsByFolder)
  .sort(([a], [b]) => a.localeCompare(b))
  .flatMap(([_, icons]) => icons.sort((a, b) => a.filename.localeCompare(b.filename)));

function getFontSize(displayName: string): string {
  if (displayName.length > 36) return "0.75rem";
  if (displayName.length > 30) return "0.85rem";
  return "0.95rem";
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [search, setSearch] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          background: {
            default: darkMode ? "#121212" : "f9f9f9",
          },
          primary: {
            main: darkMode ? "#f59e0b" : "#000000",
          },
        },
        typography: {
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        },
      }),
    [darkMode]
  );

  const filteredIcons = sortedIcons.filter((icon) => {
    const rawName = icon.filename.toLowerCase();
    const display = icon.displayName.toLowerCase();
    const keyword = search.toLowerCase();
    return rawName.includes(keyword) || display.includes(keyword);
  });

  const copyImageToClipboard = async (url: string, index: number) => {
    const blob = await fetch(url).then((res) => res.blob());
    try {
      await navigator.clipboard.write([
        new window.ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1000);
    } catch (err) {
      alert("Failed to copy image.");
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        width="100%"
      >
        <Box
          component="header"
          py={3}
          px={2}
          borderBottom={1}
          borderColor="divider"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            bgcolor: "background.default",
            width: "100%",
          }}
        >
          <Container maxWidth="lg">
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                flexDirection={{ xs: "column", sm: "row" }}
              >
                <a href="https://iamabrom.github.io/aws-icons/">
                  <img src="./awslogo.png" alt="AWS Icons Logo" style={{ height: 60 }} />
                </a>
                <Typography variant="h5" fontWeight={600} textAlign="center">
                  AWS Service Architecture Icons
                </Typography>
                <Typography fontWeight={100} textAlign="center">
                  <a href="https://aws.amazon.com/architecture/icons/" target="_blank">Icon Source</a> |
                  <a href="https://github.com/iamabrom/aws-icons" target="_blank"> GitHub Repo</a>
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ width: "100%", maxWidth: 800, minWidth: 300 }}
              >
                <TextField
                  variant="outlined"
                  placeholder="Search AWS service icons..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment:
                      search && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearch("")} edge="end">
                            <Clear fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                  }}
                  fullWidth
                  sx={{
                    backgroundColor: "background.paper",
                    borderRadius: 10,
                    flex: 1,
                  }}
                />
                <IconButton onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Box>
            </Box>
          </Container>
        </Box>

        <Box flex={1} py={2} px={2} display="flex" flexDirection="column" width="100%">
          <Container maxWidth="xl">
            <Typography variant="h6" align="center" mb={4} sx={{ fontWeight: 200 }}>
              {filteredIcons.length} AWS service icon(s) found
            </Typography>

            <GridLegacy container spacing={3}>
              {filteredIcons.map(({ filename, displayName, url }, index) => (
                <GridLegacy item key={index} xs={12} sm={6} md={4} lg={2} xl={2}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    p={1}
                    borderRadius={3}
                    bgcolor="background.paper"
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "0.2s",
                      height: 225,
                      overflow: "hidden",
                      ":hover": {
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Box
                      minHeight={45}
                      width="100%"
                      display="flex"
                      alignItems="flex-start"
                      justifyContent="center"
                    >
                      <Typography
                        variant="subtitle2"
                        color="text.primary"
                        textAlign="center"
                        sx={{
                          wordBreak: "break-word",
                          fontWeight: 600,
                          fontSize: getFontSize(displayName),
                        }}
                      >
                        {displayName}
                      </Typography>
                    </Box>
                    <img
                      src={url}
                      alt={filename}
                      style={{ width: 85, height: 85, objectFit: "contain" }}
                    />
                    <Box mt={1} width="100%">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => copyImageToClipboard(url, index)}
                        fullWidth
                        sx={{
                          fontSize: "1rem",
                          textTransform: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {copiedIndex === index ? "Copied!" : "Copy"}
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => downloadImage(url, filename)}
                        fullWidth
                        sx={{
                          mt: 0.5,
                          fontSize: "0.85rem",
                          textTransform: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Download
                      </Button>
                    </Box>
                  </Box>
                </GridLegacy>
              ))}
            </GridLegacy>
          </Container>
        </Box>

        {showScrollTop && (
          <IconButton
            onClick={scrollToTop}
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
              bgcolor: "primary.main",
              color: "#fff",
              ":hover": { bgcolor: "primary.dark" },
              boxShadow: 3,
            }}
          >
            ↑
          </IconButton>
        )}
      </Box>
    </ThemeProvider>
  );
}
