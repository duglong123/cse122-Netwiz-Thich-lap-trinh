export interface InspectorLayer {
  label: string;
  name: string;
  value: string;
  code: string;
  note: string;
}

export interface ChapterVisualTheme {
  number: string;
  alias: string;
  sector: string;
  color: string;
  rgb: string;
  inspectorTitle: string;
  coreTitle: string;
  coreSub: string;
  layers: InspectorLayer[];
}

export const CHAPTER_THEMES: Record<string, ChapterVisualTheme> = {
  'ch-1': {
    number: '01',
    alias: 'Signal Vanguard',
    sector: 'Sector 01 // Physical Edge',
    color: '#f4d35e',
    rgb: '244, 211, 94',
    inspectorTitle: 'Packet Switching & Delay Scanner',
    coreTitle: '2 ms / 10 Mbps',
    coreSub: 'd_nodal = d_proc + d_queue + L/R + d/s',
    layers: [
      {
        label: 'end-system.host',
        name: 'Application Payload (L)',
        value: 'L = 12,000 bits',
        code: `packet.header = { src: "10.0.1.5", dst: "10.0.9.8" };\npacket.size_bits = 12000; // Kích thước gói L`,
        note: 'Dữ liệu được chia thành từng gói nhỏ (Packet Switching) kèm địa chỉ đích thay vì chiếm dụng kênh cố định.',
      },
      {
        label: 'link.transmission',
        name: 'Transmission Delay (L/R)',
        value: '2.0 ms @ 6 Mbps',
        code: `transmission_delay = L / R;\n// 12,000 bits / 6,000,000 bps = 0.002s (2 ms)`,
        note: 'Thời gian để đẩy toàn bộ các bit của gói tin lên đường truyền có tốc độ R.',
      },
      {
        label: 'router.queue',
        name: 'Store-and-Forward Buffer',
        value: 'Queuing Delay',
        code: `if (buffer.used >= buffer.max) {\n  drop_packet(); // Packet Loss\n}`,
        note: 'Router nhận trọn vẹn gói tin trước khi chuyển tiếp. Nếu lưu lượng vượt tốc độ ra, hàng đợi đầy gây Packet Loss.',
      },
      {
        label: 'path.bottleneck',
        name: 'End-to-End Throughput',
        value: 'min(R1, R2, R3)',
        code: `throughput = Math.min(100, 10, 1000); // Mbps\n// Giới hạn bởi liên kết cổ chai: 10 Mbps`,
        note: 'Thông lượng thực tế luôn bị giới hạn bởi chặng có băng thông nhỏ nhất trên toàn tuyến.',
      },
    ],
  },
  'ch-2': {
    number: '02',
    alias: 'Topology Architect',
    sector: 'Sector 02 // Structural Grid',
    color: '#4da3ff',
    rgb: '77, 163, 255',
    inspectorTitle: 'Topology Resilience Matrix',
    coreTitle: 'N(N-1) / 2 Links',
    coreSub: 'Spine-Leaf • Star • Full Mesh',
    layers: [
      {
        label: 'topology.bus',
        name: 'Shared Backbone (Bus)',
        value: 'Single Cable',
        code: `bus_backbone = "shared_coax";\n// Đứt trục chính => sập toàn phân đoạn`,
        note: 'Chi phí cáp thấp nhất nhưng dễ xung đột tín hiệu và có điểm lỗi đơn trên trục chính.',
      },
      {
        label: 'topology.star',
        name: 'Centralized Star',
        value: 'Switch Hub SPOF',
        code: `star.hosts.forEach(h => link(h, central_switch));\n// Lỗi 1 dây cáp chỉ ảnh hưởng đúng 1 máy`,
        note: 'Cô lập lỗi từng nhánh cáp rất tốt; tuy nhiên cần dự phòng cho Switch trung tâm.',
      },
      {
        label: 'topology.full-mesh',
        name: 'Full Mesh Redundancy',
        value: 'O(N²) Links',
        code: `links = N * (N - 1) / 2;\n// Với N = 6 Router => 15 liên kết trực tiếp`,
        note: 'Độ dự phòng tối đa nhưng chi phí cổng và cáp tăng theo bậc bình phương khi mở rộng N.',
      },
      {
        label: 'topology.spine-leaf',
        name: 'Data Center Spine-Leaf',
        value: '2-Hop Uniform',
        code: `leaf_switches.connectAll(spine_switches);\n// East-West traffic luôn qua đúng 2 chặng`,
        note: 'Kiến trúc 2 tầng không nghẽn giúp mọi máy chủ giao tiếp với độ trễ đồng đều.',
      },
    ],
  },
  'ch-3': {
    number: '03',
    alias: 'Seven-Layer Sentinel',
    sector: 'Sector 03 // OSI Core',
    color: '#45d5bd',
    rgb: '69, 213, 189',
    inspectorTitle: 'OSI 7-Layer Encapsulation Stack',
    coreTitle: 'Segment → Packet → Frame → Bit',
    coreSub: 'L7 Application → L1 Physical',
    layers: [
      {
        label: 'L7..L5 // App-Session',
        name: 'Data & TLS Encryption',
        value: 'HTTP / TLS / DNS',
        code: `L7_App: "GET /index.html HTTP/1.1"\nL6_Presentation: encrypt(TLS_1_3, payload)\nL5_Session: sync_checkpoint(session_id)`,
        note: 'Tầng 7 cung cấp giao thức ứng dụng; Tầng 6 mã hóa/nén; Tầng 5 quản lý phiên đối thoại.',
      },
      {
        label: 'L4 // Transport',
        name: 'Segment + Port Header',
        value: 'TCP:443 / UDP:53',
        code: `segment.srcPort = 51422;\nsegment.dstPort = 443; // HTTPS`,
        note: 'Đơn vị PDU là Segment (TCP) hoặc Datagram (UDP), định danh tiến trình bằng số Port.',
      },
      {
        label: 'L3 // Network',
        name: 'Packet + IP Routing',
        value: 'Router • IPv4/IPv6',
        code: `packet.srcIP = "192.168.1.10";\npacket.dstIP = "93.184.216.34"; // Giữ nguyên qua Router`,
        note: 'Router đọc IP để định tuyến liên mạng. Địa chỉ IP đầu-cuối giữ nguyên (nếu không NAT).',
      },
      {
        label: 'L2..L1 // Link & Physical',
        name: 'Frame (MAC) → Bit Stream',
        value: 'Switch • Hop-by-Hop',
        code: `frame.srcMAC = "00:1A:2B:3C:4D:5E"; // Đổi theo chặng\nphysical.transmit(bits_on_fiber);`,
        note: 'Switch chuyển Frame theo bảng MAC trong LAN; ARP phân giải từ IP sang MAC.',
      },
    ],
  },
  'ch-4': {
    number: '04',
    alias: 'Protocol Commander',
    sector: 'Sector 04 // TCP/IP Grid',
    color: '#ff6262',
    rgb: '255, 98, 98',
    inspectorTitle: 'TCP Handshake & CIDR Calculator',
    coreTitle: 'SYN → SYN-ACK → ACK',
    coreSub: '2^(32 - prefix) - 2 Hosts',
    layers: [
      {
        label: 'tcp.step-1 // SYN',
        name: 'Client Initiates Handshake',
        value: 'SYN=1, seq=x',
        code: `client -> server: TCP [SYN] seq=1000\n// Yêu cầu mở kết nối hướng kết nối`,
        note: 'Client gửi cờ SYN kèm Sequence Number ban đầu để đồng bộ luồng byte.',
      },
      {
        label: 'tcp.step-2 // SYN-ACK',
        name: 'Server Acknowledges',
        value: 'SYN=1, ACK=1',
        code: `server -> client: TCP [SYN-ACK] seq=5000 ack=1001`,
        note: 'Server chấp nhận kết nối, xác nhận đã nhận gói SYN (ack = x + 1) và gửi seq của mình.',
      },
      {
        label: 'tcp.step-3 // ACK',
        name: 'Session Established',
        value: 'ACK=5001',
        code: `client -> server: TCP [ACK] ack=5001\n// Sẵn sàng truyền dữ liệu song công`,
        note: 'Hoàn tất bắt tay 3 bước. Khi đóng kết nối sẽ dùng bắt tay 4 bước (FIN/ACK).',
      },
      {
        label: 'ip.cidr // 192.168.10.0/26',
        name: 'Subnet Mask & Hosts',
        value: '62 Usable Hosts',
        code: `mask = "255.255.255.192"; // /26\nhosts = Math.pow(2, 32 - 26) - 2; // 62`,
        note: 'Địa chỉ đầu (.0) là Network ID, địa chỉ cuối (.63) là Broadcast; 62 địa chỉ ở giữa gán cho Host.',
      },
    ],
  },
  'ch-5': {
    number: '05',
    alias: 'Zero-Day Guardian',
    sector: 'Sector 05 // Cyber Citadel',
    color: '#51dc85',
    rgb: '81, 220, 133',
    inspectorTitle: 'Defense-in-Depth Security Stack',
    coreTitle: 'CIA + TLS + IPS',
    coreSub: 'Confidentiality • Integrity • Availability',
    layers: [
      {
        label: 'cia.triad',
        name: 'Confidentiality • Integrity • Availability',
        value: 'AES / HMAC / Anti-DDoS',
        code: `confidentiality = encrypt(TLS);\nintegrity = hmac_sha256(payload);\navailability = rate_limit(ddos_filter);`,
        note: 'Ba trụ cột an toàn thông tin bảo vệ bí mật, chống sửa đổi và duy trì tính sẵn sàng.',
      },
      {
        label: 'l2.switch-guard',
        name: 'Dynamic ARP Inspection (DAI)',
        value: 'Chống ARP Spoofing',
        code: `switch.enable("ip arp inspection vlan 10");\n// Đối chiếu IP-MAC với DHCP Snooping`,
        note: 'Ngăn kẻ tấn công giả mạo bản tin ARP để nghe lén lưu lượng nội bộ trong LAN.',
      },
      {
        label: 'l4.stateful-fw',
        name: 'Stateful Firewall + IPS',
        value: 'Inline Blocking',
        code: `firewall.stateTable.track(session);\nips.inlineDrop(signatureMatch);`,
        note: 'Firewall theo dõi trạng thái phiên kết nối; IPS đứng trực tiếp trên đường truyền để chặn gói độc hại.',
      },
      {
        label: 'l7.tls-pki',
        name: 'HTTPS / TLS + CA Certificate',
        value: 'Chống MitM',
        code: `tls.verifyCertificateChain(serverCert, trustedCA);\n// Mã hóa & xác thực danh tính máy chủ`,
        note: 'Ngăn chặn nghe lén và giả mạo Man-in-the-Middle trên đường truyền công cộng.',
      },
    ],
  },
};
