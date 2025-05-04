import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
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
            default: darkMode ? "#121212" : "#f9f9f9",
          },
          primary: {
            main: "#f59e0b",
          },
        },
        typography: {
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        },
      }),
    [darkMode]
  );

  const filteredIcons = sortedIcons.filter((icon) =>
    icon.filename.toLowerCase().includes(search.toLowerCase())
  );

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
          py={4}
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
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
            >
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ width: 800, minWidth: 800, maxWidth: 800 }}
              >
                <TextField
                  variant="outlined"
                  placeholder="Search icons..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: search && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearch("")}
                          edge="end"
                        >
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

        <Box
          flex={1}
          py={4}
          px={2}
          display="flex"
          flexDirection="column"
          width="100%"
        >
          <Container maxWidth="xl">
            <Typography
              variant="h5"
              align="center"
              mb={4}
              sx={{ fontWeight: 600 }}
            >
              {filteredIcons.length} AWS services found
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              {filteredIcons.map(({ filename, displayName, url }, index) => (
                <Grid item key={index} sx={{ width: 220 }}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    p={2}
                    borderRadius={3}
                    bgcolor="background.paper"
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "0.2s",
                      height: 240,
                      overflow: "hidden",
                      ":hover": {
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      mb={1}
                      color="text.primary"
                      textAlign="center"
                      sx={{
                        wordBreak: "break-word",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      }}
                    >
                      {displayName}
                    </Typography>
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
                </Grid>
              ))}
            </Grid>
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
