// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

library URINormalizer {
    /**
     * @dev Normalizes a URI by:
     *  - Lowercasing the scheme (before "://")
     *  - Lowercasing the host (immediately following "://", up to the next '/', '?', '#' or end)
     *
     * Leaves the rest of the URI (path, query, fragment) untouched.
     */
    function normalizeURI(
        string memory uri
    ) internal pure returns (string memory) {
        bytes memory uriBytes = bytes(uri);

        // Find "://"
        int schemeEnd = indexOf(uriBytes, "://");
        if (schemeEnd < 0) {
            return uri;
        }

        uint schemeEndPos = uint(schemeEnd);
        uint hostStart = schemeEndPos + 3;

        uint hostEnd = findHostEnd(uriBytes, hostStart);

        // Lowercase scheme
        for (uint i = 0; i < schemeEndPos; i++) {
            uriBytes[i] = toLower(uriBytes[i]);
        }

        // Lowercase host
        for (uint i = hostStart; i < hostEnd; i++) {
            uriBytes[i] = toLower(uriBytes[i]);
        }

        return string(uriBytes);
    }

    function indexOf(
        bytes memory haystack,
        string memory needle
    ) internal pure returns (int) {
        bytes memory n = bytes(needle);
        if (n.length == 0 || n.length > haystack.length) return -1;

        for (uint i = 0; i <= haystack.length - n.length; i++) {
            bool matchFound = true;
            for (uint j = 0; j < n.length; j++) {
                if (haystack[i + j] != n[j]) {
                    matchFound = false;
                    break;
                }
            }
            if (matchFound) return int(i);
        }
        return -1;
    }

    function findHostEnd(
        bytes memory uriBytes,
        uint start
    ) internal pure returns (uint) {
        for (uint i = start; i < uriBytes.length; i++) {
            bytes1 c = uriBytes[i];
            if (c == 0x2F || c == 0x3F || c == 0x23) return i;
        }
        return uriBytes.length;
    }

    function toLower(bytes1 b) internal pure returns (bytes1) {
        if (b >= 0x41 && b <= 0x5A) return bytes1(uint8(b) + 32);
        return b;
    }
}
